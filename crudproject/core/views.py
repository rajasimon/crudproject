from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from .models import RequestLog
from .serializers import UserSerializer, RequestLogSerializer


# Create your views here.
def index(request):
    return render(request, "index.html")


class UserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserPKView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def put(self, request, *args, **kwargs):
        user = self.get_queryset().filter(pk=kwargs["pk"]).first()

        username = request.data.get("username")
        if not username:
            username = user.username

        email = request.data.get("email")
        if not email:
            email = user.email

        first_name = request.data.get("first_name")
        if not first_name:
            first_name = user.first_name

        last_name = request.data.get("last_name")
        if not last_name:
            last_name = user.last_name
        data = {
            "username": username,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
        }
        serializer = self.get_serializer(
            user,
            data=data,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def request_log_view(request):
    request_logs = RequestLog.objects.all()
    return render(request, "requestlog.html", {"request_logs": request_logs})
