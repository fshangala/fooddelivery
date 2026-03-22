'use client';

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { useEffect, useState, useCallback } from 'react';

// Fix for default icon issue with webpack
import 'leaflet/dist/leaflet.css';
const defaultIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface LocationPickerProps {
    onLocationChange: (lat: number, lng: number, address: string) => void;
}

interface GeocodingResponse {
    display_name: string;
    error?: string;
}

interface SearchResult {
    lat: string;
    lon: string;
    display_name: string;
}

function MapController({ position }: { position: LatLngExpression | null }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 16);
        }
    }, [position, map]);
    return null;
}

function LocationMarker({ 
    position, 
    setPosition, 
    onLocationChange 
}: { 
    position: LatLngExpression | null, 
    setPosition: (pos: LatLngExpression | null) => void,
    onLocationChange: (lat: number, lng: number, address: string) => void
}) {
    const fetchAddress = useCallback((lat: number, lng: number) => {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(response => response.json())
            .then((data: GeocodingResponse) => {
                if (data.display_name) {
                    onLocationChange(lat, lng, data.display_name);
                }
            })
            .catch(err => console.error("Error fetching address: ", err));
    }, [onLocationChange]);

    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition(e.latlng);
            fetchAddress(lat, lng);
        },
        locationfound(e) {
            const { lat, lng } = e.latlng;
            setPosition(e.latlng);
            map.flyTo(e.latlng, 13);
            fetchAddress(lat, lng);
        }
    });

    useEffect(() => {
        map.locate();
    }, [map]);

    return position === null ? null : (
        <Marker position={position} icon={defaultIcon} />
    );
}

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
    const [position, setPosition] = useState<LatLngExpression | null>(null);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data: SearchResult[] = await response.json();
            
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newLat = parseFloat(lat);
                const newLon = parseFloat(lon);
                const newPos: LatLngExpression = [newLat, newLon];
                
                setPosition(newPos);
                onLocationChange(newLat, newLon, display_name);
            } else {
                alert("Location not found. Please try a more specific address.");
            }
        } catch (error) {
            console.error("Search error:", error);
            alert("An error occurred while searching. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search address (e.g. 123 Main St...)"
                    className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(e);
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:bg-gray-400 transition whitespace-nowrap"
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </div>
            
            <div className='h-64 w-full rounded-lg relative' style={{ zIndex: 0 }}>
                <MapContainer
                    center={[-26.2041, 28.0473]} // Default to Johannesburg
                    zoom={10}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController position={position} />
                    <LocationMarker 
                        position={position} 
                        setPosition={setPosition} 
                        onLocationChange={onLocationChange} 
                    />
                </MapContainer>
            </div>
        </div>
    );
}
