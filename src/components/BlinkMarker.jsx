import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Helper to create blinking icon using CSS
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
        const color = m.color || '#ff0000'; // fallback
        return (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={createBlinkIcon(color)}
          >
            <Popup>
              <div>
                <h3>{m.name}</h3>
                <img src={m.image} alt={m.name} width="100%" />
                <button onClick={() => window.open(m.link, '_blank')}>
                  Learn More
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default BlinkingMarkers;
