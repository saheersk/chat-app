from django.db import models
from django.contrib.auth.models import AbstractUser

from Crypto.PublicKey import RSA
from phonenumber_field.modelfields import PhoneNumberField


class User(AbstractUser):
    phone_number = PhoneNumberField(unique=True)
    is_blocked = models.BooleanField(default=False)
    public_key = models.TextField(blank=True, null=True)
    private_key = models.TextField(blank=True, null=True)

    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        if not self.public_key or not self.private_key:
            # Generate RSA key pair
            key = RSA.generate(2048)

            # Get public and private keys as strings
            public_key = key.publickey().export_key().decode()
            private_key = key.export_key().decode()

            self.public_key = public_key
            self.private_key = private_key

        super().save(*args, **kwargs)
