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

from api.views.kardex_views import KardexProductoView
from api.views.reportes_views import dashboard_resumen
from api.views.usuario_views import PermisosUsuarioView
from api.views.valor_inventario_view import ValorInventarioView
from api.views.dashboard_view import DashboardResumenView
from api.views import DashboardResumenView
from api.views.dashboard_grafica_view import DashboardGraficaView


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
from api.views.reporte_inventario_excel import ReporteInventarioExcelView
from api.views.alertas_stock_view import AlertasStockMinimoView



urlpatterns = [
    path('inventario/valor/', ValorInventarioView.as_view()),  # 👈 AQUÍ
    path('', include(router.urls)),
    # path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('dashboard/resumen/', DashboardResumenView.as_view(), name='dashboard-resumen'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('productos/<int:producto_id>/kardex/', KardexProductoView.as_view(), name='kardex-producto'),
    path('usuarios/permisos/', PermisosUsuarioView.as_view(), name='permisos-usuario'),
    path('reportes/inventario/excel/', ReporteInventarioExcelView.as_view()),
    path('alertas/stock_minimo/', AlertasStockMinimoView.as_view()),
    path("dashboard/resumen/", dashboard_resumen, name="dashboard_resumen"),
    path('kardex/<int:producto_id>/', KardexProductoView.as_view()),
    path("dashboard/grafica/", DashboardGraficaView.as_view()),
    
]
