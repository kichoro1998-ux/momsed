"""
URL configuration for todo project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.http import JsonResponse

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="Food Ordering System API",
        default_version='v1',
        description="API documentation for Food Ordering System (Admin, Restaurant, Customer)",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)


def root_info(request):
    return JsonResponse(
        {
            "message": "QuickBite backend is running.",
            "endpoints": {
                "admin": "/admin/",
                "swagger": "/swagger/",
                "redoc": "/redoc/",
                "api_base": "/api/",
            },
        }
    )


urlpatterns = [
    # Root info page
    path('', root_info),

    # Admin panel
    path('admin/', admin.site.urls),

    # Swagger / Redoc
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0)),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0)),

    # API endpoints
    path('api/', include('foodapp.urls')),
]


# Serve uploaded media files in both development and production.
# Render does not provide persistent disk, but this ensures files uploaded
# during runtime can be read back immediately by clients.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += [
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]
