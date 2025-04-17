import googlemaps

from back_end.settings import GOOGLE_MAPS_API_KEY
from vendors.models import Vendor
from django.db.models import Q
def find_nearest_lat_long_to(user_lat, user_lng, store_locations):
  """
  Finds the nearest store from a list of store locations to a specified user location.

  Args:
    user_lat: Latitude of the user's location.
    user_lng: Longitude of the user's location.
    store_locations: A list of tuples, each containing a store's latitude and longitude.

  Returns:
    A list of stores, sorted by distance from the user's location.
  """

  gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

  stores = []
  for store_lat, store_lng, store_id in store_locations:
    distance_matrix_result = gmaps.distance_matrix(
        origins={'lat': user_lat, 'lng': user_lng},
        destinations={'lat': store_lat, 'lng': store_lng},
        mode='driving'
    )
    try:
      distance = distance_matrix_result['rows'][0]['elements'][0]['distance']['text']
      duration = distance_matrix_result['rows'][0]['elements'][0]['duration']['text']

      distance = distance.replace(' km','')
      distance = distance.replace(',','')
      stores.append({
          'lat': store_lat,
          'lng': store_lng,
          'distance': float(distance),
          'duration': duration,
          'id': store_id
      })
    except Exception:
      raise KeyError('This location is out of our delivery zone')

  # Sort the stores by distance
  stores.sort(key=lambda x: x['distance'])

  return stores[0]

# # Example usage:
# user_lat = -1.2891508
# user_lng = 36.76511439999999 #nairobi
# store_locations = [
#     (-0.4532293, 39.6460988),  # Garisa
#     (-1.2892786, 36.7869311),  # Kilimani
#     ( -1.940278,  29.873888),  # Rwanda
# ]

# nearest_stores = find_nearest_lat_long_to(user_lat, user_lng, store_locations)
# print(nearest_stores)

def find_nearest_vendor(user_lat, user_lng):
  vendors = Vendor.objects.filter(~Q(latitude=None) & ~Q(longitude=None))
  if vendors.count()==0:
    raise Exception('No vendors found')
  if vendors.count() ==1:
    return vendors[0]
  
  vendor_lat_long_dict_values = vendors.values('latitude', 'longitude','id')

  vendors_tuple_list = [(float(v['latitude']), float(v['longitude']), v['id']) for v in vendor_lat_long_dict_values]

  return find_nearest_lat_long_to(user_lat, user_lng, vendors_tuple_list)

  

