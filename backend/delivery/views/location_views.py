from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from delivery.kenya_locations import KENYA_COUNTIES, locations_for_county
from delivery.models import DeliveryCity, DeliveryLocation
from delivery.serializers import DeliveryCitySerializer, DeliveryLocationSerializer


class PublicReadAdminWriteViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return []
        return [IsAdminUser()]


class DeliveryCityViewSet(PublicReadAdminWriteViewSet):
    serializer_class = DeliveryCitySerializer
    pagination_class = None

    def get_queryset(self):
        queryset = DeliveryCity.objects.prefetch_related('locations')
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        return queryset

    @action(
        detail=False,
        methods=['post'],
        url_path='seed-kenya',
        permission_classes=[IsAdminUser],
    )
    @transaction.atomic
    def seed_kenya(self, request):
        """Add missing Kenyan counties and their checkout locations."""
        cities_created = 0
        locations_created = 0

        for county_code, county_name in KENYA_COUNTIES:
            city, created = DeliveryCity.objects.get_or_create(
                name=county_name,
                defaults={'display_order': county_code},
            )
            cities_created += int(created)

            for location_order, (location_name, delivery_fee) in enumerate(
                locations_for_county(county_name), start=1
            ):
                _, created = DeliveryLocation.objects.get_or_create(
                    city=city,
                    name=location_name,
                    defaults={
                        'delivery_fee': delivery_fee,
                        'display_order': location_order,
                    },
                )
                locations_created += int(created)

        return Response(
            {
                'cities_created': cities_created,
                'locations_created': locations_created,
                'cities_total': len(KENYA_COUNTIES),
            },
            status=status.HTTP_200_OK,
        )


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
