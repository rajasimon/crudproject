from django.contrib.auth.models import User
from rest_framework import serializers

from .models import RequestLog


class UserSerializer(serializers.ModelSerializer):
    # Js PUT method seems to send null so read only allow editing.
    # username = serializers.CharField(required=False)
    # email = serializers.EmailField(required=False)
    # first_name = serializers.CharField(required=False)
    # last_name = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        extra_kwargs = {"username": {"required": False}}


class RequestLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestLog
        fields = "__all__"
