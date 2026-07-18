from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import HttpResponse


def codedesk(request):
    template = loader.get_template('CodeDesk.html')
    return HttpResponse(template.render())