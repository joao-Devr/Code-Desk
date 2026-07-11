from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import HttpResponse


def testeparametros(request):
    context = {
        "nome": "José Silva",
        "idade": 30,
        "email": "jose.silva@email.com",
        "telefone": "3333-1234",
        "usuarioativo": True,
        "condicional": 3,
        'numeros': [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
    }
    template = loader.get_template('testeparametros.html')
    return HttpResponse(template.render(context, request))

def index_app(request):
    template = loader.get_template('paginateste.html')
    return HttpResponse(template.render())