from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class PermisosUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        permisos = user.get_all_permissions()
        # permisos_limpios = [
        #     p.split('.')[-1] for p in permisos
        # ]

        permisos_api = [
        p.split('.')[-1]
        for p in permisos
        if p.startswith('api.')
     ]

        return Response({
            "username": user.username,
            "permissions": permisos_api,
            "is_superuser": user.is_superuser
        })
