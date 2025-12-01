import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Blinking Icon
const createBlinkIcon = color => {
  return L.divIcon({
    className: 'blinking-marker',
    html: `<div class="marker-circle" style="background-color: ${color}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const BlinkingMarkers = ({ markers }) => {
  return (
    <>
      {markers.map(m => {
        const color = m.color || '#ff0000';
        return (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={createBlinkIcon(color)}
          >
            <Popup>
              <div
                className="card border-0"
                data-aos="zoom-in"
                style={{ width: '14rem' }}
              >
                <img
                  src={m.image}
                  alt={m.name}
                  className="card-img-top rounded"
                />
                <div className="card-body p-2">
                  <h5 className="card-title mb-2">{m.name}</h5>
                  <button
                    className="btn btn-primary w-100 btn-sm"
                    onClick={() => window.open(m.link, '_blank')}
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i>
                    Learn More
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default BlinkingMarkers;
