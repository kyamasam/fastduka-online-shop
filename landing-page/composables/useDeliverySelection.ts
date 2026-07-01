export interface CheckoutDeliverySelection {
  cityId: number | null;
  locationId: number | null;
  cityName: string;
  locationName: string;
  deliveryFee: number;
  latitude: number | null;
  longitude: number | null;
}

export const useDeliverySelection = () => useCookie<CheckoutDeliverySelection>(
  'checkoutDelivery',
  {
    default: () => ({
      cityId: null,
      locationId: null,
      cityName: '',
      locationName: '',
      deliveryFee: 0,
      latitude: null,
      longitude: null,
    }),
  },
)
