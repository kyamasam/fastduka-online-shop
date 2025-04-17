from rest_framework import serializers

from delivery.models import Rider

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
        