from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.views import (
    CategoriaViewSet,
    ProveedorViewSet,
    ProductoViewSet,
    InventarioViewSet,
    MovimientoInventarioViewSet,
    MarcaViewSet,
    ValorInventarioView,
)

from api.views.valor_inventario_view import ValorInventarioView
from api.views.dashboard_view import DashboardResumenView
from api.views import DashboardResumenView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'proveedores',ProveedorViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'inventario', InventarioViewSet)
router.register(r'movimientos', MovimientoInventarioViewSet, basename='movimiento')
router.register(r'marcas', MarcaViewSet)




# El backend principal ya incluye este archivo bajo la ruta 'api/'
# (ver backend/urls.py). Aquí exponemos las rutas del router en la
# raíz del módulo para evitar una URL duplicada como /api/api/...

urlpatterns = [
    path('inventario/valor/', ValorInventarioView.as_view()),  # 👈 AQUÍ
    path('', include(router.urls)),
    # path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('dashboard/resumen/', DashboardResumenView.as_view(), name='dashboard-resumen'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
