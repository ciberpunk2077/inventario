from rest_framework.views import APIView
from rest_framework.response import Response

class ValorInventarioView(APIView):
    def get(self, request):
        return Response({
            "valor_total": 0
        })



