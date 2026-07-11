from django.http import HttpResponse

def teste_view(request):
    return HttpResponse("Teste de Views")

def index_view(request):
    return HttpResponse("<h1>Pagina padrão</h1> <br> <p> <a href='/myapp/'>myapp</a> </p>")