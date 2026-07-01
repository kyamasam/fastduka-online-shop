from rest_framework import serializers

from delivery.models import DeliveryCity, DeliveryLocation, Rider


class DeliveryLocationSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)

    class Meta:
        model = DeliveryLocation
        fields = [
            'id', 'city', 'city_name', 'name', 'delivery_fee', 'latitude',
            'longitude', 'display_order', 'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        latitude = attrs.get('latitude', getattr(self.instance, 'latitude', None))
        longitude = attrs.get('longitude', getattr(self.instance, 'longitude', None))
        if (latitude is None) != (longitude is None):
            raise serializers.ValidationError(
                'Latitude and longitude must be provided together.'
            )
        return attrs


class DeliveryCitySerializer(serializers.ModelSerializer):
    locations = serializers.SerializerMethodField()

    class Meta:
        model = DeliveryCity
        fields = [
            'id', 'name', 'latitude', 'longitude', 'display_order', 'is_active',
            'locations', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_locations(self, obj):
        locations = obj.locations.all()
        request = self.context.get('request')
        if not request or not request.user.is_staff:
            locations = locations.filter(is_active=True)
        return DeliveryLocationSerializer(locations, many=True).data

    def validate(self, attrs):
        latitude = attrs.get('latitude', getattr(self.instance, 'latitude', None))
        longitude = attrs.get('longitude', getattr(self.instance, 'longitude', None))
        if (latitude is None) != (longitude is None):
            raise serializers.ValidationError(
                'Latitude and longitude must be provided together.'
            )
        return attrs

class RiderSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Rider
        fields = ['id', 'user', 'vendor', 'approval_status', 'user_email', 'user_name']
        read_only_fields = ['id']

class RiderApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rider
        fields = ['approval_status']
