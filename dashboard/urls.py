from django.urls import path
from . import views


app_name = 'dashboard'

urlpatterns = [
    
    path('producto', views.producto, name='producto'),
]
