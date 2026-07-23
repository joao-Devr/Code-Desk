from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def codedesk(request):
   return render(request, 'CodeDesk.html')