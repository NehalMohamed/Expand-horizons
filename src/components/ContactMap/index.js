import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers (same as your existing code)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const ContactMap = () => {
    const hurghadaPosition = [27.2579, 33.8116]; // Hurghada coordinates [lat, lng]
    
    return (
        <section className="contact-map-section">
            <MapContainer
                center={hurghadaPosition}
                zoom={13}
                style={{ width: "100%", height: "500px" }}
                scrollWheelZoom={false}
                className="contact-map"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={hurghadaPosition}>
                    <Popup>
                        <strong>Hurghada, Egypt</strong><br />
                        Red Sea Governorate
                    </Popup>
                </Marker>
            </MapContainer>
        </section>
    );
}

export default ContactMap;