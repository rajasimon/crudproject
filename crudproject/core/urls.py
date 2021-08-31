from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users/", views.UserView.as_view(), name="users"),
    path("users/<int:pk>/", views.UserPKView.as_view(), name="users_pk"),
    path("requestlog/", views.request_log_view),
]
