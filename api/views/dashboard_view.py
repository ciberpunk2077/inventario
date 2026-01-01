from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.services.dashboard_service import DashboardService
from api.serializers.dashboard_serializers import DashboardResumenSerializer


class DashboardResumenView(APIView):
    """
    View del dashboard.
    Solo orquesta: llama al service y devuelve la respuesta.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1️⃣ Obtener datos desde el service
        data = DashboardService.obtener_resumen()

        # 2️⃣ Validar formato con el serializer
        # serializer = DashboardResumenSerializer(data)
        serializer = DashboardResumenSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        # 3️⃣ Responder al frontend
        return Response(serializer.data)
