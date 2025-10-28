from rest_framework import viewsets, status,parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.utils import timezone
from .models import SiteSettings
from .serializers import SiteSettingsSerializer

class SiteSettingsViewSet(viewsets.GenericViewSet):
    serializer_class = SiteSettingsSerializer
    queryset = SiteSettings.objects.all()
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    
    def get_permissions(self):
        """
        Only allow admin users to modify settings
        Allow authenticated users to retrieve settings
        """
        if self.action == 'list':
            return []
        if self.action in ['retrieve', 'public']:
            return [IsAuthenticated()]
        return [IsAdminUser()]
    
    def list(self, request):
        """
        Return the singleton instance of settings
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """
        Always return the singleton regardless of requested pk
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def create(self, request):
        """
        Create settings if none exist, otherwise update existing
        """
        if SiteSettings.objects.exists():
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        """
        Update the singleton instance
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_at=timezone.now())
        return Response(serializer.data)
    
    def partial_update(self, request, pk=None):
        """
        Partially update the singleton instance
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_at=timezone.now())
        return Response(serializer.data)
    
    def get_object(self):
        """
        Return the singleton instance or create one if it doesn't exist
        """
        queryset = self.filter_queryset(self.get_queryset())
        obj = queryset.first()
        if not obj:
            obj = SiteSettings.objects.create(
                title="Site Settings",
                description="Default site description"
            )
        return obj
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def public(self, request):
        """
        Return only public settings (excludes sensitive data like API keys)
        """
        instance = self.get_object()
        data = self.get_serializer(instance).data
        
        # Remove sensitive fields
        sensitive_fields = [
            'fastduka_api_key', 'google_maps_api_key', 
            'smtp_password', 'smtp_user'
        ]
        for field in sensitive_fields:
            if field in data:
                data[field] = None
                
        return Response(data)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def upload_site_icon(self, request):
        """
        Upload site icon
        """
        instance = self.get_object()
        
        if 'site_icon' not in request.FILES:
            return Response(
                {'error': 'No file provided. Please upload a file with key "site_icon".'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        instance.site_icon = request.FILES['site_icon']
        instance.updated_at = timezone.now()
        instance.save()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def upload_site_logo(self, request):
        """
        Upload site logo
        """
        instance = self.get_object()
        
        if 'site_logo' not in request.FILES:
            return Response(
                {'error': 'No file provided. Please upload a file with key "site_logo".'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        instance.site_logo = request.FILES['site_logo']
        instance.updated_at = timezone.now()
        instance.save()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
        
    @action(detail=False, methods=['delete'], permission_classes=[IsAdminUser])
    def remove_site_icon(self, request):
        """
        Remove site icon
        """
        instance = self.get_object()
        
        # Check if there's an existing icon to delete
        if instance.site_icon:
            # Delete the file
            instance.site_icon.delete(save=False)
            instance.site_icon = None
            instance.updated_at = timezone.now()
            instance.save()
            
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['delete'], permission_classes=[IsAdminUser])
    def remove_site_logo(self, request):
        """
        Remove site logo
        """
        instance = self.get_object()
        
        # Check if there's an existing logo to delete
        if instance.site_logo:
            # Delete the file
            instance.site_logo.delete(save=False)
            instance.site_logo = None
            instance.updated_at = timezone.now()
            instance.save()
            
        serializer = self.get_serializer(instance)
        return Response(serializer.data)