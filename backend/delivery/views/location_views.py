from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from delivery.models import DeliveryCity, DeliveryLocation
from delivery.serializers import DeliveryCitySerializer, DeliveryLocationSerializer


class PublicReadAdminWriteViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return []
        return [IsAdminUser()]


class DeliveryCityViewSet(PublicReadAdminWriteViewSet):
    serializer_class = DeliveryCitySerializer

    def get_queryset(self):
        queryset = DeliveryCity.objects.prefetch_related('locations')
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        return queryset


class DeliveryLocationViewSet(PublicReadAdminWriteViewSet):
    serializer_class = DeliveryLocationSerializer

    def get_queryset(self):
        queryset = DeliveryLocation.objects.select_related('city')
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True, city__is_active=True)
        city_id = self.request.query_params.get('city')
        if city_id:
            queryset = queryset.filter(city_id=city_id)
        return queryset
