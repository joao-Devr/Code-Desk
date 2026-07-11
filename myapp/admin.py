from django.contrib import admin

# Register your models here.

from .models import tarefaModel
from .models import Livro

admin.site.register(Livro)
admin.site.register(tarefaModel)