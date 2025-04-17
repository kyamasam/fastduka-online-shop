<!-- components/LocationSearch.vue -->
<template>
  <div class="location-search">
    <div class="search-container">
      {{ searchInputModel }}
      <input
        ref="searchInput"
        :value="inputValue"
        type="text"
        placeholder="Search for a location..."
        class="w-full p-2 border rounded"
      />
    </div>

    <div class="search-results mt-4">
      <p>Selected Location: {{ selectedAddress }}</p>
      <p>Latitude: {{ latitude }}</p>
      <p>Longitude: {{ longitude }}</p>
    </div>

    <div ref="mapDiv" class="h-48 w-full mt-4 mb-4"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
const config = useRuntimeConfig();
const pickOnMap = ref(false);
const inputValue = ref("");

const searchInput = ref(null);
const mapDiv = ref(null);
const selectedAddress = ref("");
const latitude = ref("");
const longitude = ref("");

const props = defineProps({
  location_address: {
    type: String,
  },
  default_latitude: {
    type: Number,
    default: -1.286389,
  },
  default_longitude: {
    type: Number,
    default: 36.817223,
  },
});

let map = null;
let marker = null;
let autocomplete = null;
const mapsApiKey = config.public.googleMapsApiKey;
// Load Google Maps script
const loadGoogleMapsScript = () => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  return new Promise((resolve) => {
    script.onload = resolve;
  });
};

const initMap = () => {
  // Initialize map with default center (e.g., Nairobi)
  const defaultCenter = {
    lat: props.default_latitude,
    lng: props.default_longitude,
  };

  map = new google.maps.Map(mapDiv.value, {
    center: defaultCenter,
    zoom: 13,
  });

  marker = new google.maps.Marker({
    map: map,
    position: defaultCenter,
    draggable: true,
    visible: true, // Make it visible by default
  });

  // Initialize autocomplete
  autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
    types: ["geocode"],
  });

  // Bind autocomplete to map bounds
  autocomplete.bindTo("bounds", map);

  // Add listener for place selection
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      alert("No details available for this place");
      return;
    }

    updateLocationDetails(place);
  });

  // Add listener for marker drag
  marker.addListener("dragend", () => {
    const position = marker.getPosition();
    updateLocationDetailsFromLatLng(position.lat(), position.lng());
  });
};

const updateLocationDetails = (place) => {
  // Update map view
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(17);
  }

  // Update marker
  marker.setPosition(place.geometry.location);
  marker.setVisible(true);

  // Update location details and input value
  selectedAddress.value = place.formatted_address;
  inputValue.value = place.formatted_address; // Add this line
  latitude.value = place.geometry.location.lat();
  longitude.value = place.geometry.location.lng();

  // Emit location details to parent component
  emit("location-selected", {
    address: selectedAddress.value,
    lat: latitude.value,
    lng: longitude.value,
  });
};

const updateLocationDetailsFromLatLng = async (lat, lng) => {
  const geocoder = new google.maps.Geocoder();

  try {
    const response = await geocoder.geocode({
      location: { lat, lng },
    });

    if (response.results[0]) {
      selectedAddress.value = response.results[0].formatted_address;
      inputValue.value = response.results[0].formatted_address; // Add this line
      latitude.value = lat;
      longitude.value = lng;

      emit("location-selected", {
        address: selectedAddress.value,
        lat: latitude.value,
        lng: longitude.value,
      });
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
  }
};
// Define emits
const emit = defineEmits(["location-selected"]);

onMounted(async () => {
  console.log("mounting");
  inputValue.value = props.location_address || "";

  await loadGoogleMapsScript();
  initMap();
  if (props.location_address) {
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({
        address: props.location_address,
      });

      if (response.results[0]) {
        const place = response.results[0];
        updateLocationDetails(place);
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    }
  }
});
</script>
