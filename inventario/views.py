from django.shortcuts import render

def main(request):
    return render(request, 'inventario/main.html')        # página principal

