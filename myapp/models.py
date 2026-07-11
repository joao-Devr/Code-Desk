from django.db import models

# Create your models here.

class Livro(models.Model):
    nome = models.CharField("Título", max_length=255)
    autor = models.CharField("Autor", max_length=255)
    ano = models.IntegerField("Ano de publicação")
    editora = models.CharField("Editora", max_length=255,null=True)

    def __str__(self):
        return f"{self.nome} - {self.autor} - {self.ano} - {self.editora}"

class tarefaModel(models.Model):
    nome = models.CharField("Nome", max_length=100)
    descricao = models.TextField("Descrição", null=True, blank=True)
    completo = models.BooleanField("Completo", default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome
    