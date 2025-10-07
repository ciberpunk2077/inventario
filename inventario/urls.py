from django.urls import path
from . import views
from dashboard import views 

app_name = 'inventario'

urlpatterns = [
      path('', views.main, name='main'),            # Inicio
   
]