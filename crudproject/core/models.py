from enum import auto
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class RequestLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    class RequestType(models.IntegerChoices):
        GET = 1
        POST = 2
        PUT = 3
        DELETE = 4

    request_type = models.IntegerField(choices=RequestType.choices)
    created = models.DateTimeField(auto_now_add=True)
