from django.urls import path
from . import views

app_name="app"

urlpatterns = [

    path('codedesk/',views.codedesk,name="codedesk"),
]