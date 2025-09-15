import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { useTranslation } from 'react-i18next';


const GEO_KEY = process.env.REACT_APP_GEOAPIFY_KEY;


// Small helper component to recenter map when marker changes
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position?.lat && position?.lng) {
      map.flyTo([position.lat, position.lng], 15, { duration: 1 }); // smooth fly animation
    }
  }, [position, map]);
  return null;
}

// Handle map clicks
function ClickToSet({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const PickupLocation = ({ onChange, value }) => {
   const { t } = useTranslation();
  const [pickupOption, setPickupOption] = useState(value?.enabled ? "yes" : "no");
  const [marker, setMarker] = useState(
    value?.latitude && value?.longitude 
      ? { lat: value.latitude, lng: value.longitude } 
      : { lat: 27.2579, lng: 33.8116 }
  );
  const acContainerRef = useRef(null);
  const acRef = useRef(null);

   useEffect(() => {
      if (value) {
        setPickupOption(value.enabled ? "yes" : "no");
        if (value.latitude && value.longitude) {
          setMarker({ lat: value.latitude, lng: value.longitude });
        }
      }
    }, [value]);

  // Setup Geoapify Autocomplete once when "yes" selected
  useEffect(() => {
    if (pickupOption !== "yes" || !GEO_KEY || !acContainerRef.current || acRef.current) return;

    const ac = new GeocoderAutocomplete(acContainerRef.current, GEO_KEY, {
      placeholder: "Search or select on map...",
      debounceDelay: 300,
      filter: { countrycode: ["eg"] },
    });

    if (value?.address) {
      ac.setValue(value.address);
    }

    ac.on("select", (feature) => {
      const p = feature?.properties || {};
      if (p.lat && p.lon) {
        const newPos = { lat: p.lat, lng: p.lon };
        setMarker(newPos);
        fireChange(newPos, p.formatted);
      }
    });

    acRef.current = ac;

    return () => {
      if (acRef.current) {
        acRef.current = null;
      }
    };
  }, [pickupOption]);

  const fireChange = (coords, formatted) => {
    onChange?.({
      enabled: pickupOption === "yes",
      address: formatted,
      latitude: coords.lat,
      longitude: coords.lng,
    });
  };

  // Reverse geocode when clicking map & update input value
  const handleMapClick = async ({ lat, lng }) => {
    setMarker({ lat, lng });
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&lang=en&apiKey=${GEO_KEY}`
      );
      const data = await res.json();
      const formatted = data?.features?.[0]?.properties?.formatted || "";
      if (acRef.current && formatted) {
        acRef.current.setValue(formatted);
      }
      fireChange({ lat, lng }, formatted);
    } catch (err) {
      console.log("Reverse geocoding failed", err);
    }
  };

  const handleOptionChange = (option) => {
    setPickupOption(option);
    if (option === "no") {
      // Clear pickup location when selecting "no"
      onChange?.({
        enabled: false,
        address: '',
        latitude: null,
        longitude: null
      });
    }
  };

  return (
    <div className="pickup-section">
      <h2 className="pickup-title">{t('bookings.pickup.addPickUp')}</h2>

      <div className="pickup-options">
        <label className="pickup-option">
          <input
            type="radio"
            name="pickup-option"
            value="yes"
            checked={pickupOption === "yes"}
            onChange={() => handleOptionChange("yes")}
          />
          <span className="checkmark"></span>
          {t('bookings.pickup.canAddNow')}
        </label>

        <label className="pickup-option">
          <input
            type="radio"
            name="pickup-option"
            value="no"
            checked={pickupOption === "no"}
            onChange={() => handleOptionChange("no")}
          />
          <span className="checkmark"></span>
          {t('bookings.pickup.dontKnow')}
        </label>
      </div>

      {pickupOption === "yes" && (
        <>
          {/* Geoapify renders input here */}
          <div ref={acContainerRef} style={{ maxWidth: "500px", margin: "1rem 0" }} />

          {/* Map */}
          <div style={{ height: 400, borderRadius: "12px", overflow: "hidden" }}>
            <MapContainer center={marker} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={marker} />
              <RecenterMap position={marker} />
              <ClickToSet onPick={handleMapClick} />
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default PickupLocation;
