import React, { useState, useEffect, useContext } from 'react';
import {
  APIProvider,
  Map,
  InfoWindow,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';

import MyLocationControl from './MyLocationControl';
import ResetZoomControl from './ResetZoomControl';
import PolygonControl from './PolygonControl';
import CityFilterControl from './CityFilterControl';
import MaskLayer from './MaskLayer';
import { GlobalContext } from '../../context/GlobalContext';

const GoogleMap = () => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [activeMarker, setActiveMarker] = useState(null);

  const handleMarkerClick = id => {
    setActiveMarker(id);
  };

  const {
    darkMode, setDarkMode,
    markers, setMarkers,
    portugalGeo, setPortugalGeo,
  } = useContext(GlobalContext);

  const cardStyle = darkMode ? { background: '#222', color: '#fff' } : {};

  return (
    <div className="container">
      <div className="text-center mb-4" data-aos="fade-up">
        <p style={cardStyle}>Google Maps API</p>
      </div>
      <APIProvider apiKey={API_KEY} libraries={['drawing']}>
        <Map
          style={{ width: '100%', height: '80vh' }}
          defaultCenter={{ lat: 39.3999, lng: -8.2245 }}
          defaultZoom={7}
          gestureHandling="greedy"
          mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
          options={{
            zoomControl: true, // enable zoom buttons
            streetViewControl: true,
            mapTypeControl: false,
            fullscreenControl: true,
            scaleControl: false,
            rotateControl: false,
            keyboardShortcuts: false,
            clickableIcons: false,
            scrollwheel: true,
          }}
        >
          {/* CSS Blinking Circle Markers */}
          {markers.map(m => (
            <AdvancedMarker
              key={m.id}
              position={{ lat: m.lat, lng: m.lng }}
              onClick={() => handleMarkerClick(m.id)}
            >
              <div
                className="marker-circle"
                style={{
                  backgroundColor: m.color ?? '#ff0000',
                }}
              />
            </AdvancedMarker>
          ))}

          {/* InfoWindows */}
          {markers.map(
            m =>
              activeMarker === m.id && (
                <InfoWindow
                  key={m.id}
                  position={{ lat: m.lat, lng: m.lng }}
                  onCloseClick={() => setActiveMarker(null)}
                >
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
                </InfoWindow>
              )
          )}

          <MaskLayer />

          <MyLocationControl />
          <ResetZoomControl />
          <PolygonControl />
          <CityFilterControl />
        </Map>
      </APIProvider>
    </div>
  );
};

export default GoogleMap;
