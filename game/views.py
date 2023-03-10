from django.shortcuts import render
from django.http import Http404

# Create your views here.

from django.shortcuts import render, redirect

def index(request):
    if request.method == "POST":
        room_code = request.POST.get("room_code")
        char_choice = request.POST.get("character_choice")
        return redirect(
            '/play/%s?&choice=%s' 
            %(room_code, char_choice)
        )
    return render(request, "index.html", {})


def game(request, room_code):
    choice = request.GET.get("choice")
    if choice not in ['X', 'O']:
        raise Http404("Choice does not exists")
    context = {
        "char_choice": choice, 
        "room_code": room_code
    }
    return render(request, "game.html", context)    