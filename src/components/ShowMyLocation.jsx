import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

const ShowMyLocation = () => {
  const map = useMap();

  useEffect(() => {
    // Wait for the zoom control to exist
    const zoomControl = document.querySelector('.leaflet-control-zoom');
    if (!zoomControl) return;

    // Create a new button inside the zoom panel
    const btn = L.DomUtil.create(
      'a',
      'leaflet-control-zoom-location leaflet-control-zoom-in',
      zoomControl
    );

    btn.innerHTML = '📍';
    btn.href = '#';
    btn.title = 'Show my location';

    // Styling to match Leaflet buttons visually
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.fontSize = '18px';

    btn.onclick = e => {
      e.preventDefault();

      if (!navigator.geolocation) {
        alert('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;

          // Move map to user’s location WITHOUT changing zoom
          map.panTo([latitude, longitude], { animate: true });

          // Optional: add a marker or a circle
          L.circleMarker([latitude, longitude], {
            radius: 8,
            weight: 2,
            color: '#1976d2',
            fillColor: '#42a5f5',
            fillOpacity: 0.7,
          }).addTo(map);
        },
        () => {
          alert('Unable to get your location');
        }
      );
    };

    // Cleanup on unmount
    return () => {
      if (zoomControl.contains(btn)) zoomControl.removeChild(btn);
    };
  }, [map]);

  return null;
};

export default ShowMyLocation;
