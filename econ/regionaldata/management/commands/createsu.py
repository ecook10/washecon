
# Defines a command that lets AWS define a superuser on deployment

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):

    def handle(self, *args, **options):
        if not User.objects.filter(username="washecon").exists():
            User.objects.create_superuser("washecon", "evan_cookie@yahoo.com", "gohawk5")