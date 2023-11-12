from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User

class UserAdmin(UserAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'phone_number')

admin.site.register(User, UserAdmin)
