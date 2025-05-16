from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Organization, CargoRequest, AnalyticsData

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_approved', 'phone']
        read_only_fields = ['is_approved']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'first_name', 'last_name', 'role', 'phone']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'owner', 'created_at']
        read_only_fields = ['owner']

class CargoRequestSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.get_full_name', read_only=True)
    logistician_name = serializers.CharField(source='logistician.get_full_name', read_only=True)
    
    class Meta:
        model = CargoRequest
        fields = ['id', 'title', 'description', 'driver', 'driver_name', 'logistician', 
                 'logistician_name', 'organization', 'amount', 'status', 'created_at', 'updated_at']
        read_only_fields = ['organization']

class AnalyticsDataSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.get_full_name', read_only=True)
    logistician_name = serializers.CharField(source='logistician.get_full_name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = AnalyticsData
        fields = ['id', 'organization', 'organization_name', 'driver', 'driver_name', 
                 'logistician', 'logistician_name', 'total_amount', 'total_cargos', 'month', 'year'] 