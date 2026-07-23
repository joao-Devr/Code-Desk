from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import HttpResponse


def codedesk(request):
   return render(request, 'CodeDesk.html')