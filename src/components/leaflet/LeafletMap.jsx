import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import ResetView from './ResetView';
import ShowMyLocation from './ShowMyLocation';
import RegionSelector from './RegionSelector';
import PolygonEditor from './PolygonEditor';
import MaskLayer from './MaskLayer';

import { GlobalContext } from '../../context/GlobalContext';

import L from 'leaflet';

const INITIAL_CENTER = [39.5, -8];
const INITIAL_ZOOM = 7;

const LeafletMap = () => {

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

  const {
    darkMode, setDarkMode,
    markers, setMarkers

  } = useContext(GlobalContext);

  const cardStyle = darkMode ? { background: '#222', color: '#fff' } : {};

  const createBlinkIcon = (color = '#ff0000') => {
    return L.divIcon({
      className: 'blinking-marker',
      html: `<div class="marker-circle" style="background-color: ${color}"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  return (
    <div className="container">
      <div className="text-center mb-4" data-aos="fade-up">
        <p style={cardStyle}>Leaflet Maps</p>
      </div>

      <div className="card shadow border-0">
        <div className="card-body p-0">
          <MapContainer
            center={INITIAL_CENTER}
            zoom={INITIAL_ZOOM}
            scrollWheelZoom={true}
            zoomControl={true}
            className="w-100"
            style={{ height: '80vh', borderRadius: '0 0 0.5rem 0.5rem' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Controls */}
            <ResetView center={[39.3999, -8.2245]} zoom={7} />
            <ShowMyLocation />
            <RegionSelector regions={regions} />
            <PolygonEditor />

            {/* Markers */}
            {markers.map(m => (
              <Marker
                key={m.id}
                position={[m.lat, m.lng]}
                icon={createBlinkIcon(m.color)}
              >
                <Popup>
                  <div
                    className="card shadow-sm border-0 rounded-3 overflow-hidden"
                    style={{ width: '15rem' }}
                    data-aos="fade-up"
                  >
                    <div className="position-relative">
                      <img
                        src={m.image}
                        alt={m.name}
                        className="card-img-top"
                        style={{
                          height: '120px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>

                    <div className="card-body p-3">
                      <h5 className="card-title fw-semibold text-center mb-3">
                        {m.name}
                      </h5>

                      <button
                        className="btn btn-primary w-100 btn-sm d-flex align-items-center justify-content-center gap-2"
                        onClick={() => window.open(m.link, '_blank')}
                      >
                        <i className="bi bi-box-arrow-up-right"></i>
                        Learn More
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            <MaskLayer />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeafletMap);
