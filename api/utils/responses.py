from rest_framework.response import Response

def success(data=None, mensaje="OK", status=200):
    return Response(
        {
            "mensaje": mensaje,
            "data": data
        },
        status=status
    )

def error(mensaje, status=400, data=None):
    return Response(
        {
            "mensaje": mensaje,
            "data": data
        },
        status=status
    )
