from django.contrib import admin

from delivery.models import DeliveryCity, DeliveryLocation, Rider


class DeliveryLocationInline(admin.TabularInline):
    model = DeliveryLocation
    extra = 1
    fields = (
        'name',
        'delivery_fee',
        'latitude',
        'longitude',
        'display_order',
        'is_active',
    )
    ordering = ('display_order', 'name')


@admin.register(DeliveryCity)
class DeliveryCityAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'latitude',
        'longitude',
        'location_count',
        'display_order',
        'is_active',
        'updated_at',
    )
    list_filter = ('is_active',)
    list_editable = ('display_order', 'is_active')
    search_fields = ('name', 'locations__name')
    ordering = ('display_order', 'name')
    inlines = (DeliveryLocationInline,)

    @admin.display(description='Locations')
    def location_count(self, obj):
        return obj.locations.count()


@admin.register(DeliveryLocation)
class DeliveryLocationAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'city',
        'delivery_fee',
        'latitude',
        'longitude',
        'display_order',
        'is_active',
        'updated_at',
    )
    list_filter = ('city', 'is_active')
    list_editable = ('delivery_fee', 'display_order', 'is_active')
    search_fields = ('name', 'city__name')
    ordering = ('city__display_order', 'display_order', 'name')
    autocomplete_fields = ('city',)
    list_select_related = ('city',)


@admin.register(Rider)
class RiderAdmin(admin.ModelAdmin):
    list_display = ('user', 'vendor', 'approval_status', 'is_active')
    list_filter = ('approval_status', 'is_active', 'vendor')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    raw_id_fields = ('user', 'vendor')
