from django.urls import path
from . import  views


urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.RegisterUserView.as_view(), name='register_user'),
    path('api/', views.publicUsers, name = 'public_users'),
]