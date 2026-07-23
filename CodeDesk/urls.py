from django.urls import path
from . import views

app_name="CodeDesk"

urlpatterns = [

    path('',views.codedesk,name="codedesk"),
]