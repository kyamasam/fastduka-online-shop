from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from delivery.models import DeliveryCity, DeliveryLocation
from delivery.serializers import DeliveryLocationSerializer


class DeliveryLocationTests(TestCase):
    def setUp(self):
        self.city = DeliveryCity.objects.create(
            name='Nairobi', latitude=-1.286389, longitude=36.817223
        )

    def test_public_city_list_contains_active_locations(self):
        DeliveryLocation.objects.create(
            city=self.city, name='Westlands', delivery_fee=Decimal('250.00')
        )
        response = APIClient().get('/api/delivery-cities/')

        self.assertEqual(response.status_code, 200)
        payload = response.json().get('results', response.json())
        self.assertEqual(payload[0]['locations'][0]['name'], 'Westlands')
        self.assertEqual(payload[0]['locations'][0]['delivery_fee'], '250.00')

    def test_public_city_list_hides_inactive_locations(self):
        DeliveryLocation.objects.create(
            city=self.city,
            name='Unavailable',
            delivery_fee=Decimal('100.00'),
            is_active=False,
        )
        response = APIClient().get('/api/delivery-cities/')
        payload = response.json().get('results', response.json())

        self.assertEqual(payload[0]['locations'], [])

    def test_coordinates_must_be_supplied_as_a_pair(self):
        serializer = DeliveryLocationSerializer(data={
            'city': self.city.id,
            'name': 'Kilimani',
            'delivery_fee': '200.00',
            'latitude': -1.2921,
        })

        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
