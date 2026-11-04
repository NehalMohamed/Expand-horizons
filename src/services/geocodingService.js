import axios from "axios";
const popularHotels = [
  {
    id: "hotel-1",
    isPopular: true,
    name: "Jaz Soma Beach",
    address: "Soma Bay, Red Sea, Egypt",
    lat: 26.845,
    lng: 33.99,
  },
  {
    id: "hotel-2",
    isPopular: true,
    name: "Steigenberger ALDAU Beach Hotel",
    address: "Hurghada, Red Sea, Egypt",
    lat: 27.177,
    lng: 33.826,
  },
];
const API_KEY = process.env.REACT_APP_ORS_API_KEY;

// Returns merged place results from predefined hotels and ORS geocoding.
export const searchPlaces = async (query) => {
  if (!API_KEY) {
    throw new Error("Missing REACT_APP_ORS_API_KEY");
  }

  if (!query) return [];

  const hurghadaBounds = {
    minLon: 33.5,
    minLat: 26.6,
    maxLon: 34.2,
    maxLat: 27.5,
  };

  const response = await axios.get(
    "https://api.openrouteservice.org/geocode/search",
    {
      params: {
        api_key: API_KEY,
        text: query,
        "boundary.country": "EGY",
        "boundary.rect": `${hurghadaBounds.minLon},${hurghadaBounds.minLat},${hurghadaBounds.maxLon},${hurghadaBounds.maxLat}`,
      },
    },
  );

  const apiResults = (response.data.features || []).filter((feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    // Limit geocoding suggestions to configured service area.
    return (
      lon >= hurghadaBounds.minLon &&
      lon <= hurghadaBounds.maxLon &&
      lat >= hurghadaBounds.minLat &&
      lat <= hurghadaBounds.maxLat
    );
  });

  // const hotelResults = popularHotels.filter(
  //   (hotel) =>
  //     hotel.name.toLowerCase().includes(query.toLowerCase()) ||
  //     hotel.address.toLowerCase().includes(query.toLowerCase()),
  // );
  return [...apiResults];
  //return [...hotelResults, ...apiResults];
};

// Converts map coordinates to a readable address feature.
export const reverseGeocode = async (lat, lng) => {
  if (!API_KEY) {
    throw new Error("Missing REACT_APP_ORS_API_KEY");
  }

  const response = await axios.get(
    "https://api.openrouteservice.org/geocode/reverse",
    {
      params: {
        api_key: API_KEY,
        "point.lat": lat,
        "point.lon": lng,
      },
    },
  );

  return response.data.features[0];
};

export const getCurrentLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Reverse Geocoding using OpenRouteService
          const response = await fetch(
            `https://api.openrouteservice.org/geocode/reverse?point.lat=${latitude}&point.lon=${longitude}&size=1`,
            {
              headers: {
                Authorization: API_KEY,
              },
            },
          );

          if (!response.ok) {
            throw new Error("Failed to get address from ORS");
          }

          const data = await response.json();

          const address = data.features?.[0]?.properties?.label || "";

          resolve({
            address: address,
            latitude: latitude,
            longitude: longitude,
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  });
};
