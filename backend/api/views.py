from django.shortcuts import render
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from django.db.models.functions import ExtractMonth, ExtractYear
from .models import Organization, CargoRequest, AnalyticsData
from .serializers import (
    UserSerializer, UserRegistrationSerializer, OrganizationSerializer,
    CargoRequestSerializer, AnalyticsDataSerializer
)

User = get_user_model()

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in [User.Role.OWNER, User.Role.ADMIN]
    
    def has_object_permission(self, request, view, obj):
        if request.user.role == User.Role.ADMIN:
            return True
        if hasattr(obj, 'organization'):
            return obj.organization.owner == request.user
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        return False

class IsLogistician(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == User.Role.LOGISTICIAN and request.user.is_approved

class RegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        if self.request.user.role in [User.Role.OWNER, User.Role.ADMIN]:
            if self.request.user.organization:
                return User.objects.filter(organization=self.request.user.organization)
            return User.objects.none()
        return User.objects.none()
    
    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        user = self.get_object()
        user.is_approved = True
        user.save()
        return Response({'status': 'user approved'})
    
    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        user = self.get_object()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        if self.request.user.role == User.Role.OWNER:
            return Organization.objects.filter(owner=self.request.user)
        if self.request.user.role == User.Role.ADMIN:
            return Organization.objects.all()
        return Organization.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CargoRequestViewSet(viewsets.ModelViewSet):
    serializer_class = CargoRequestSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsLogistician]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.OWNER:
            return CargoRequest.objects.filter(organization=user.organization)
        elif user.role == User.Role.LOGISTICIAN:
            return CargoRequest.objects.filter(logistician=user)
        elif user.role == User.Role.DRIVER:
            return CargoRequest.objects.filter(driver=user)
        elif user.role == User.Role.ADMIN:
            return CargoRequest.objects.all()
        return CargoRequest.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        cargo = self.get_object()
        status = request.data.get('status')
        if status not in [choice[0] for choice in CargoRequest.Status.choices]:
            return Response({'status': 'invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        cargo.status = status
        cargo.save()
        return Response({'status': 'cargo status updated'})

class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role not in [User.Role.OWNER, User.Role.ADMIN] or not user.organization:
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        organization = user.organization
        
        # Get analytics data
        cargo_analytics = CargoRequest.objects.filter(organization=organization).annotate(
            month=ExtractMonth('created_at'),
            year=ExtractYear('created_at')
        ).values('driver', 'logistician', 'month', 'year').annotate(
            total_amount=Sum('amount'),
            total_cargos=Count('id')
        ).order_by('year', 'month')
        
        # Calculate totals
        total_cargo_amount = CargoRequest.objects.filter(organization=organization).aggregate(Sum('amount'))
        total_cargos = CargoRequest.objects.filter(organization=organization).count()
        
        # Format for response
        results = {
            "organization": {
                "id": organization.id,
                "name": organization.name,
                "total_amount": total_cargo_amount['amount__sum'] or 0,
                "total_cargos": total_cargos
            },
            "monthly_data": []
        }
        
        for item in cargo_analytics:
            driver = User.objects.filter(id=item['driver']).first()
            logistician = User.objects.filter(id=item['logistician']).first()
            
            results["monthly_data"].append({
                "month": item['month'],
                "year": item['year'],
                "driver": {
                    "id": driver.id if driver else None,
                    "name": driver.get_full_name() if driver else "Unknown"
                },
                "logistician": {
                    "id": logistician.id if logistician else None,
                    "name": logistician.get_full_name() if logistician else "Unknown"
                },
                "total_amount": item['total_amount'],
                "total_cargos": item['total_cargos']
            })
        
        return Response(results)
