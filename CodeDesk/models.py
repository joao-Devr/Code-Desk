from django.db import models

# Create your models here.

class Aluno(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    turma = models.CharField(max_length=50)
    matricula = models.CharField(max_length=9, unique=True)

    def __str__(self):
        return self.nome