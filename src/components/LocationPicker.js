'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Component to handle map clicks and move the marker
function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function LocationPicker({ initialLocation, initialLat, initialLng, onChange }) {
    const [searchQuery, setSearchQuery] = useState(initialLocation || '');
    const [position, setPosition] = useState(initialLat && initialLng ? [initialLat, initialLng] : null);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const mapRef = useRef(null);

    // Default view: Center of US, zoomed out
    const defaultCenter = [39.8283, -98.5795];
    const defaultZoom = 4;

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching location:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLocation = (result) => {
        const newPos = [parseFloat(result.lat), parseFloat(result.lon)];
        setPosition(newPos);
        setSearchQuery(result.display_name);
        setSearchResults([]);
        
        if (mapRef.current) {
            mapRef.current.setView(newPos, 13);
        }

        // Notify parent
        onChange({
            name: result.display_name,
            latitude: newPos[0],
            longitude: newPos[1]
        });
    };

    // Update parent when marker is clicked manually
    useEffect(() => {
        if (position && !searchResults.length) {
            onChange({
                name: searchQuery,
                latitude: position[0],
                longitude: position[1]
            });
        }
    }, [position]);

    return (
        <div style={{ width: '100%', border: '1px solid #eedbfa', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Search Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem', background: '#f8f9fa' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // Also notify parent of text changes even if map isn't used
                        onChange({ name: e.target.value, latitude: position?.[0], longitude: position?.[1] });
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                    placeholder="Search for cemetery or location..."
                    className="form-input"
                    style={{ flex: 1, margin: 0 }}
                />
                <button 
                    type="button" 
                    onClick={handleSearch}
                    className="pill-btn-primary"
                    style={{ padding: '0.5rem 1rem' }}
                >
                    {isSearching ? '...' : 'Search'}
                </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div style={{ maxHeight: '150px', overflowY: 'auto', background: 'white', borderBottom: '1px solid #eedbfa' }}>
                    {searchResults.map((res, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleSelectLocation(res)}
                            style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f1f1' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f3e8ff'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                        >
                            {res.display_name}
                        </div>
                    ))}
                </div>
            )}

            {/* Map */}
            <div style={{ height: '300px', width: '100%' }}>
                <MapContainer 
                    center={position || defaultCenter} 
                    zoom={position ? 13 : defaultZoom} 
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>
            <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#888', background: '#f8f9fa' }}>
                Search for an address or click directly on the map to pinpoint the exact location.
            </div>
        </div>
    );
}
