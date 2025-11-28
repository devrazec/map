import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import markersJson from '../data/markers.json';
import portugalJson from '../data/portugal.json';

import ResetView from './ResetView';
import ShowMyLocation from './ShowMyLocation';
import RegionSelector from './RegionSelector';
import PolygonEditor from './PolygonEditor';

import L from 'leaflet';
import '../assets/css/map.css';

const INITIAL_CENTER = [39.5, -8];
const INITIAL_ZOOM = 7;

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [portugalGeo, setPortugalGeo] = useState(null);

  const regions = {
    All: L.latLngBounds([
      [38.7, -9.5],
      [41.2, -7.5],
    ]),
    Lisbon: L.latLngBounds([
      [38.69, -9.25],
      [38.82, -9.05],
    ]),
    Porto: L.latLngBounds([
      [41.11, -8.74],
      [41.19, -8.53],
    ]),
    Faro: L.latLngBounds([
      [37.0, -8.1],
      [37.2, -7.8],
    ]),
  };

  const portugalBounds = [
    [36.9, -9.5], // southwest corner
    [42.2, -6.0], // northeast corner
  ];

  useEffect(() => {
    setMarkers(markersJson);
    setPortugalGeo(portugalJson);
  }, []);

  const handlePolygonChange = geojson => {
    console.log('Polygon GeoJSON:', geojson);
  };

  const createBlinkIcon = (color = '#ff0000') => {
    return L.divIcon({
      className: 'blinking-marker', // optional for global CSS
      html: `<div class="marker-circle" style="background-color: ${color}"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8], // centers the marker
    });
  };

  return (
    <section className="map-section">
      <div className="map-container-wrapper">
        <h2 className="map-heading">Interactive Map</h2>

        <div className="map-card">
          <MapContainer
            center={INITIAL_CENTER}
            zoom={INITIAL_ZOOM}
            scrollWheelZoom={true}
            zoomControl={true}
            //maxBounds={portugalCoords}
            //maxBoundsViscosity={1.0}
            className="map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Controls */}
            <ResetView center={[39.5, -8]} zoom={7} />
            <ShowMyLocation />
            <RegionSelector regions={regions} />
            <PolygonEditor onChange={handlePolygonChange} />

            {/* Portugal outline */}
            {portugalGeo && (
              <GeoJSON
                data={portugalGeo}
                style={{
                  color: '#d35400',
                  weight: 2,
                  fillColor: '#f1c40f',
                  fillOpacity: 0.15,
                }}
              />
            )}

            {/* Markers */}
            {markers.map(m => (
              <Marker
                key={m.id}
                position={[m.lat, m.lng]}
                icon={createBlinkIcon(m.color)} // pass color from JSON or default
              >
                <Popup>
                  <div className="popup-card">
                    <img src={m.image} alt={m.name} className="popup-image" />
                    <h3 className="popup-title">{m.name}</h3>
                    <button
                      className="popup-button"
                      onClick={() => window.open(m.link, '_blank')}
                    >
                      Learn More
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Map);
