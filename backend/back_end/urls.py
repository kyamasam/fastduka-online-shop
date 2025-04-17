
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.conf import settings
from django.conf.urls.static import static
from users.urls import url_patterns as user_url_patterns
from inventory.urls import url_patterns as inventory_url_patterns
from orders.urls import url_patterns as orders_url_patterns
from products.urls import url_patterns as product_url_patterns
from vendors.urls import url_patterns as vendor_url_patterns
from delivery.urls import url_patterns as delivery_url_patterns

urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/', include([*user_url_patterns,
                          *inventory_url_patterns,
                          *orders_url_patterns, 
                          *product_url_patterns,
                          *vendor_url_patterns,
                          *delivery_url_patterns
                          ])),
    path('admin/', admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
