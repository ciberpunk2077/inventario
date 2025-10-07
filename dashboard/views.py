from django.shortcuts import render

# Create your views here.
def main(request):
    return render(request, 'inventario/main.html')

def producto(request):
    return render(request, 'dashboard/producto.html')