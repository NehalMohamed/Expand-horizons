import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "500px"
};

const center = {
    lat: 36.7378, // Fresno latitude
    lng: -119.7871 // Fresno longitude
};

const ContactMap = () => {
    return (
        <section className="contact-map-section">
            <LoadScript googleMapsApiKey="AIzaSyBieQVRLXfTRKbNH0U5g6rqgm9vWFrh6J0">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                >
                    <Marker position={{ lat: 36.7378, lng: -119.7871 }} />
                </GoogleMap>
            </LoadScript>
        </section>
    );
}

export default ContactMap;
