from rest_framework import serializers
from user_auth.models import User


class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    password = serializers.CharField()
    phone_number = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError("Passwords do not match.")

        data.pop('confirm_password')

        if not data.get('first_name'):
            raise serializers.ValidationError("First name is required.")
        if not data.get('last_name'):
            raise serializers.ValidationError("Last name is required.")
        if not data.get('username'):
            raise serializers.ValidationError("Username is required.")
        if User.objects.filter(username=data.get('username')).exists():
            raise serializers.ValidationError("Username is already taken.")
        if not data.get('phone_number'):
            raise serializers.ValidationError("Phone number is required.")
        if User.objects.filter(phone_number=data.get('phone_number')).exists():
            raise serializers.ValidationError("Phone number is already registered.")

        return data

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data['phone_number']
        )
        user.set_password(validated_data['password'])
        user.save()
        return validated_data


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username:
            raise serializers.ValidationError("Username is required.")
        if not password:
            raise serializers.ValidationError("Password is required.")

        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError("User not Found.")

        return data
    