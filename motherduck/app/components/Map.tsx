"use client"

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface CrimeDataPoint {
    datetime: string;
    category: string;
    description: string;
    latitude: number;
    longitude: number;
    policeDistrict: string;
}

interface MapProps {
    crimeData: CrimeDataPoint[];
}

export default function Map({ crimeData }: MapProps) {
    return (
        <div style={{ height: "600px", width: "100%" }}>
            <MapContainer
                center={[37.7749, -122.4194]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {crimeData.map((crime, index) => (
                    <CircleMarker
                        key={index}
                        center={[crime.latitude, crime.longitude]}
                        radius={8}
                        fillColor="red"
                        color="darkred"
                        weight={1}
                        opacity={0.8}
                        fillOpacity={0.6}
                    >
                        <Popup>
                            <div>
                                <p><strong>Category:</strong> {crime.category}</p>
                                <p><strong>Description:</strong> {crime.description}</p>
                                <p><strong>Date/Time:</strong> {crime.datetime}</p>
                                <p><strong>District:</strong> {crime.policeDistrict}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
} 