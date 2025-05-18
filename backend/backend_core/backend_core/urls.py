"""
URL configuration for backend_core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from .views import home  # Import the home view

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # Include search app only once with api prefix for consistency
    path('api/search/', include('search.urls')),
    path('api/auth/', include('auth_api.urls')),  # Authentication endpoints
    path('knowledge_graphs/', include('knowledge_graphs.urls')),
    path('nlp/', include('nlp.urls')),
    path('preprocessing/', include('preprocessing.urls')),
    # Removed duplicate search URL pattern to avoid conflicts
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)