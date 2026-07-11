from django.urls import path
from . import views

app_name="app"

urlpatterns = [

    path('',views.index_app,name="home"),
    path('testeparametros/', views.testeparametros,name="parametros"),
]