<template>
  <div class="location-search">
    <div class="search-container">
      <input ref="autocompleteInput"
             v-model="searchQuery"
             @input="handleInput"
             type="text"
             placeholder="Search for a location..."
             class="search-input" />

      <!-- Dropdown for suggestions -->
      <div v-if="suggestions.length > 0"
           class="suggestions-dropdown">
        <div v-for="(suggestion, index) in suggestions"
             :key="index"
             @click="selectPlace(suggestion)"
             class="suggestion-item">
          {{ suggestion.text }}
        </div>
      </div>
    </div>

    <div class="search-results mt-4">
      <p>Selected Location: {{ selectedAddress }}</p>
      <p>Latitude: {{ latitude }}</p>
      <p>Longitude: {{ longitude }}</p>
    </div>

    <div ref="mapDiv"
         class="h-48 w-full mt-4 mb-4"></div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
const config = useRuntimeConfig();

// Define emit first, before using it
const emit = defineEmits(["location-selected"]);

const autocompleteInput = ref(null);
const mapDiv = ref(null);
const searchQuery = ref("");
const suggestions = ref([]);
const selectedAddress = ref("");
const latitude = ref("");
const longitude = ref("");

const props = defineProps({
  location_address: {
    type: String,
    default: "",
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
let debounceTimer = null;
const mapsApiKey = config.public.googleMapsApiKey;

const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onerror = reject;
    script.onload = resolve;

    document.head.appendChild(script);
  });
};

const initMap = async () => {
  // Use provided coordinates if available, otherwise use defaults
  const defaultCenter = {
    lat: props.default_latitude || -1.286389,
    lng: props.default_longitude || 36.817223,
  };

  map = new google.maps.Map(mapDiv.value, {
    center: defaultCenter,
    zoom: 13,
  });

  marker = new google.maps.Marker({
    map: map,
    position: defaultCenter,
    draggable: true,
  });

  // Add listener for marker drag
  marker.addListener("dragend", () => {
    const position = marker.getPosition();
    updateLocationDetailsFromLatLng(position.lat(), position.lng());
  });

  // Initialize with provided data
  if (props.location_address && props.default_latitude && props.default_longitude) {
    // Set initial values
    searchQuery.value = props.location_address;
    selectedAddress.value = props.location_address;
    latitude.value = props.default_latitude;
    longitude.value = props.default_longitude;

    // Update map
    const position = {
      lat: props.default_latitude,
      lng: props.default_longitude,
    };
    map.setCenter(position);
    marker.setPosition(position);
    map.setZoom(17);
  } else if (props.location_address) {
    // Only address provided, geocode it
    searchQuery.value = props.location_address;
    geocodeAddress(props.location_address);
  }
};

const handleInput = () => {
  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Debounce the API call
  debounceTimer = setTimeout(() => {
    if (searchQuery.value.trim().length > 2) {
      fetchAutocompleteSuggestions(searchQuery.value);
    } else {
      suggestions.value = [];
    }
  }, 300);
};

const fetchAutocompleteSuggestions = async (input) => {
  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": mapsApiKey,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
        },
        body: JSON.stringify({
          input: input,
          locationBias: {
            circle: {
              center: {
                latitude: props.default_latitude || -1.286389,
                longitude: props.default_longitude || 36.817223,
              },
              radius: 50000.0, // 50km radius
            },
          },
          languageCode: "en",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.suggestions && data.suggestions.length > 0) {
      suggestions.value = data.suggestions
        .filter((s) => s.placePrediction)
        .map((s) => ({
          placeId: s.placePrediction.placeId,
          text: s.placePrediction.text.text,
        }));
    } else {
      suggestions.value = [];
    }
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    suggestions.value = [];
  }
};

const selectPlace = async (suggestion) => {
  searchQuery.value = suggestion.text;
  suggestions.value = [];

  try {
    // Fetch place details using Place Details API
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${suggestion.placeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": mapsApiKey,
          "X-Goog-FieldMask": "location,formattedAddress,displayName",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const place = await response.json();

    if (place.location) {
      updateLocationDetails({
        formattedAddress: place.formattedAddress,
        location: place.location,
      });
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
    // Fallback to geocoding
    geocodeAddress(suggestion.text);
  }
};

const updateLocationDetails = (place) => {
  console.log("Selected place:", place);
  if (!place.location) {
    console.warn("Place has no location");
    return;
  }

  const lat = place.location.latitude;
  const lng = place.location.longitude;
  const position = { lat, lng };

  // Update map view
  map.setCenter(position);
  map.setZoom(17);

  // Update marker position
  marker.setPosition(position);

  // Update component state - CRITICAL: Set these values properly
  selectedAddress.value = place.formattedAddress || "";
  latitude.value = lat;
  longitude.value = lng;

  console.log("Updated values:", {
    address: selectedAddress.value,
    lat: latitude.value,
    lng: longitude.value,
  });

  // Emit event to parent component
  emit("location-selected", {
    address: selectedAddress.value,
    lat: latitude.value,
    lng: longitude.value,
  });
};

const updateLocationDetailsFromLatLng = async (lat, lng) => {
  const geocoder = new google.maps.Geocoder();
  try {
    const { results } = await geocoder.geocode({ location: { lat, lng } });
    if (results && results[0]) {
      searchQuery.value = results[0].formatted_address;
      selectedAddress.value = results[0].formatted_address;
      latitude.value = lat;
      longitude.value = lng;

      console.log("Updated from drag:", {
        address: selectedAddress.value,
        lat: latitude.value,
        lng: longitude.value,
      });

      emit("location-selected", {
        address: selectedAddress.value,
        lat: latitude.value,
        lng: longitude.value,
      });
    }
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
  }
};

const geocodeAddress = async (address) => {
  const geocoder = new google.maps.Geocoder();
  try {
    const { results } = await geocoder.geocode({ address: address });
    if (results && results[0]) {
      const place = {
        formattedAddress: results[0].formatted_address,
        location: {
          latitude: results[0].geometry.location.lat(),
          longitude: results[0].geometry.location.lng(),
        },
      };
      updateLocationDetails(place);
    }
  } catch (error) {
    console.error("Geocoding failed for initial address:", error);
  }
};

// Close suggestions when clicking outside
const handleClickOutside = (event) => {
  if (
    autocompleteInput.value &&
    !autocompleteInput.value.contains(event.target)
  ) {
    suggestions.value = [];
  }
};

// Watch for prop changes and update display
watch(
  () => [props.location_address, props.default_latitude, props.default_longitude],
  ([newAddress, newLat, newLng]) => {
    if (newAddress && newLat && newLng && map) {
      searchQuery.value = newAddress;
      selectedAddress.value = newAddress;
      latitude.value = newLat;
      longitude.value = newLng;

      const position = { lat: newLat, lng: newLng };
      map.setCenter(position);
      marker.setPosition(position);
      map.setZoom(17);
    }
  },
  { immediate: false }
);

onMounted(async () => {
  try {
    await loadGoogleMapsScript();
    await nextTick();
    await initMap();

    // Add click outside listener
    document.addEventListener("click", handleClickOutside);
  } catch (error) {
    console.error("Failed to load Google Maps:", error);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<style scoped>
.location-search {
  width: 100%;
  position: relative;
}

.search-container {
  width: 100%;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.search-results {
  margin-top: 1rem;
}

.search-results p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 14px;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.h-48 {
  height: 12rem;
}

.w-full {
  width: 100%;
}
</style>