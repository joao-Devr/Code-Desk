from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from django.contrib.auth import logout as logout_django

def logout(request):
    logout_django(request)
    return render(request, 'login.html')

def login(request):

    template = loader.get_template('index.html')

    if request.method == "GET": # se for via método "GET":
        return HttpResponse(template.render({}, request))
    
    else: # senão será via método "POST":
        usuario = request.POST.get('email-entrar')
        senha = request.POST.get('senha-entrar')
        user_obj = User.objects.filter(email=usuario).first()
        user = authenticate(username=user_obj.username, password=senha) if user_obj else None

        if user: # se o usuário for autenticado com sucesso vai para a rota do outro app  CodeDesk.html 

            login_django(request, user)
            return redirect('app:codedesk')  # Redireciona para a rota do outro app
        
        else: # se o usuário não for autenticado com sucesso
            messages.error(request, 'Usuário ou senha inválidos. Tente novamente.')
            return HttpResponse(template.render({}, request))


def cadastro(request): 
    if request.method == "GET":
        return render(request, 'cadastro.html')
    
    else: #senão será via método "POST":
        usuario = request.POST.get('nome-cadastro')
        email = request.POST.get('email-cadastro')
        senha = request.POST.get('senha-cadastro')

         # Verifica se o usuário já está cadastrado
        user = User.objects.filter(email=email).first()
        if user:
            messages.error(request, 'Já existe um usuário com esse email. Tente novamente.')
            return render(request, 'cadastro.html')

        # Cria e salva o usuário
        user = User.objects.create_user(username=usuario, email=email, password=senha)
        user.save()
        
        return redirect('login')