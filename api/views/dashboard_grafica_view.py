from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.services.dashboard_grafica_service import DashboardGraficaService

class DashboardGraficaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = DashboardGraficaService.movimientos_7_dias()
        return Response(data)
