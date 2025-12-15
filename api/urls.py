from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from api.views import ValorInventarioView

router = DefaultRouter()
router.register(r'categorias', views.CategoriaViewSet)
router.register(r'proveedores', views.ProveedorViewSet)
router.register(r'productos', views.ProductoViewSet)
router.register(r'inventario', views.InventarioViewSet)
router.register(r'movimientos', views.MovimientoInventarioViewSet)
router.register(r'marcas', views.MarcaViewSet)



# El backend principal ya incluye este archivo bajo la ruta 'api/'
# (ver backend/urls.py). Aquí exponemos las rutas del router en la
# raíz del módulo para evitar una URL duplicada como /api/api/...

urlpatterns = [
    path('inventario/valor/', ValorInventarioView.as_view()),  # 👈 AQUÍ
    path('', include(router.urls)),
]
