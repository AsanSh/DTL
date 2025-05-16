import os
import sys
import subprocess

def run_command(command):
    process = subprocess.Popen(command, shell=True)
    process.wait()
    return process.returncode

def main():
    print("Creating migrations...")
    run_command("python manage.py makemigrations")
    
    print("Applying migrations...")
    run_command("python manage.py migrate")
    
    print("Creating superuser...")
    run_command("python manage.py createsuperuser --noinput")

if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cargo_management.settings')
    os.environ.setdefault('DJANGO_SUPERUSER_USERNAME', 'admin')
    os.environ.setdefault('DJANGO_SUPERUSER_PASSWORD', 'admin123')
    os.environ.setdefault('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed?"
        ) from exc
    
    main() 