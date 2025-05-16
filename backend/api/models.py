from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', _('Admin')
        OWNER = 'OWNER', _('Owner')
        LOGISTICIAN = 'LOGISTICIAN', _('Logistician')
        DRIVER = 'DRIVER', _('Driver')
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.DRIVER)
    is_approved = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True, null=True)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, null=True, blank=True, related_name='members')
    
    def __str__(self):
        return self.username

class Organization(models.Model):
    name = models.CharField(max_length=255)
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='owned_organization')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class CargoRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        IN_PROGRESS = 'IN_PROGRESS', _('In Progress')
        COMPLETED = 'COMPLETED', _('Completed')
        CANCELLED = 'CANCELLED', _('Cancelled')
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_cargos', limit_choices_to={'role': User.Role.DRIVER})
    logistician = models.ForeignKey(User, on_delete=models.CASCADE, related_name='managed_cargos', limit_choices_to={'role': User.Role.LOGISTICIAN})
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='cargos')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class AnalyticsData(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='analytics')
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='driver_analytics', limit_choices_to={'role': User.Role.DRIVER}, null=True, blank=True)
    logistician = models.ForeignKey(User, on_delete=models.CASCADE, related_name='logistician_analytics', limit_choices_to={'role': User.Role.LOGISTICIAN}, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_cargos = models.IntegerField(default=0)
    month = models.IntegerField()
    year = models.IntegerField()
    
    class Meta:
        unique_together = [['organization', 'driver', 'logistician', 'month', 'year']]
    
    def __str__(self):
        return f"{self.organization.name} - {self.month}/{self.year}"
