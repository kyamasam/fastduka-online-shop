from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from delivery.models import DeliveryCity, DeliveryLocation
from delivery.serializers import DeliveryLocationSerializer
from users.models import User


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


class KenyaLocationSeedTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email='admin@example.com', password='password', is_staff=True
        )
        self.client = APIClient()
        self.client.force_authenticate(self.admin)

    def test_seed_creates_counties_and_expected_special_locations(self):
        response = self.client.post('/api/delivery-cities/seed-kenya/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(DeliveryCity.objects.count(), 47)
        self.assertEqual(
            DeliveryCity.objects.get(name='Nairobi').locations.count(), 17
        )
        self.assertEqual(
            DeliveryCity.objects.get(name='Mombasa').locations.count(), 6
        )
        self.assertTrue(
            DeliveryCity.objects.get(name='Kisumu').locations.filter(
                name='Kisumu', delivery_fee=Decimal('300.00')
            ).exists()
        )

    def test_seed_is_idempotent_and_preserves_custom_fees(self):
        self.client.post('/api/delivery-cities/seed-kenya/')
        location = DeliveryLocation.objects.get(city__name='Nairobi', name='Kibra')
        location.delivery_fee = Decimal('999.00')
        location.save()

        response = self.client.post('/api/delivery-cities/seed-kenya/')

        self.assertEqual(response.json()['cities_created'], 0)
        self.assertEqual(response.json()['locations_created'], 0)
        location.refresh_from_db()
        self.assertEqual(location.delivery_fee, Decimal('999.00'))

    def test_seed_requires_staff_user(self):
        self.client.force_authenticate(user=None)

        response = self.client.post('/api/delivery-cities/seed-kenya/')

        self.assertIn(response.status_code, (401, 403))
