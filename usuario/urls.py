from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = "usuario"

urlpatterns = [
    path('', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('cadastro/', views.cadastro, name='cadastro'),
]

