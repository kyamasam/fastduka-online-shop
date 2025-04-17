from rest_framework import serializers

from users.models import User
from users.serializers import MiniUserSerializer
from vendors.models import Vendor, VendorMember, VendorVerificationDocument

class VendorVerificationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorVerificationDocument
        fields = ['id', 'document', 'document_type']
        read_only_fields = ['id']

class VendorMemberSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(required=False)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    user = MiniUserSerializer(read_only=True, required=False)
    class Meta:
        model = VendorMember
        fields = ['id', 'user','user_id', 'role', 'user_email', 'user_name',
                  
                  ]
        read_only_fields = ['id']

    def validate(self,attrs):
        user_email = attrs.get('user_email', None)
        user = attrs.get('user_id', None)
        if user_email is  None:
            if user is None:
                raise serializers.ValidationError("Pass either user_email or userid")
        if user is None:
            if user_email is None:
                raise serializers.ValidationError("Pass either user_email or userid")
        if user_email is not None:
            user = User.objects.filter(email=user_email).first()
            if user is None:
                raise serializers.ValidationError("user with that email cannot be found")

        return super().validate(attrs)



    def create(self, validated_data):
        # Handle direct email input
        user_email = validated_data.pop('user_email', None)
        user = validated_data.get('user_id', None)

        # If no user but have email, try to find user by email
        if user is None and user_email:
            user = User.objects.filter(email=user_email).first()
            if not user:
                raise serializers.ValidationError("User with that email not found")


        # check if exists 
        member = VendorMember.objects.filter(user=user, vendor=validated_data.get('vendor')).first()
        if member is None:
            # Create the member with the found/provided user
            member = VendorMember.objects.create(
                user=user,
                role=validated_data.get('role'),
                vendor=validated_data.get('vendor')
            )
        else:
            member.role = validated_data.get('role')
            member.vendor = validated_data.get('vendor')
            member.save()
        
        return member

class VendorSerializer(serializers.ModelSerializer):
    members = VendorMemberSerializer(many=True, read_only=True)
    documents = VendorVerificationDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Vendor
        fields = ['id', 'name', 'location', 'verification_status', 'is_active', 'members', 'documents',
                  'latitude','longitude','delivery_radius'
        ]
        read_only_fields = ['id', 'verification_status', 'is_active']

class VendorDocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorVerificationDocument
        fields = ['document', 'document_type']

class VendorApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['verification_status']
