from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Organization, CargoRequest, AnalyticsData

User = get_user_model()

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_approved')
    list_filter = ('role', 'is_approved', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'is_approved', 'phone', 'organization')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'is_approved', 'phone', 'organization')}),
    )

class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_at')
    search_fields = ('name',)

class CargoRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'driver', 'logistician', 'organization', 'amount', 'status', 'created_at')
    list_filter = ('status', 'organization')
    search_fields = ('title', 'description')

class AnalyticsDataAdmin(admin.ModelAdmin):
    list_display = ('organization', 'driver', 'logistician', 'total_amount', 'total_cargos', 'month', 'year')
    list_filter = ('organization', 'month', 'year')

admin.site.register(User, CustomUserAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(CargoRequest, CargoRequestAdmin)
admin.site.register(AnalyticsData, AnalyticsDataAdmin)
