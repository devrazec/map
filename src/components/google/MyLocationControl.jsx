import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

const MyLocationControl = () => {
  const map = useMap();
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Create button
    const controlButton = document.createElement('div');
    controlButton.innerHTML = `<i class="bi bi-geo-alt-fill"></i>`;

    // CSS
    controlButton.style.display = 'flex';
    controlButton.style.alignItems = 'center';
    controlButton.style.justifyContent = 'center';
    controlButton.style.fontSize = '20px';
    controlButton.style.background = '#fff';
    controlButton.style.border = '2px solid #fff';
    controlButton.style.borderRadius = '3px';
    controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    controlButton.style.cursor = 'pointer';
    controlButton.style.margin = '10px';
    controlButton.style.padding = '6px 12px';
    controlButton.style.fontFamily = 'Roboto, Arial, sans-serif';

    // Geolocation click handler
    controlButton.onclick = () => {
      if (!navigator.geolocation) {
        alert('Geolocation not supported by your browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          const userLatLng = new google.maps.LatLng(latitude, longitude);

          // If a marker already exists → move it
          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition(userLatLng);
          } else {
            // Create marker once
            userMarkerRef.current = new google.maps.Marker({
              position: userLatLng,
              map,
              title: 'You are here',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
                scale: 8,
              },
            });
          }

          // Center map on location
          map.panTo(userLatLng);
          map.setZoom(7);
        },
        err => {
          if (err.code === err.PERMISSION_DENIED) {
            alert('Location access denied.');
          } else {
            alert('Unable to retrieve your location.');
          }
        }
      );
    };

    // Add to map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlButton);

    // Cleanup
    return () => {
      const controls = map.controls[google.maps.ControlPosition.TOP_LEFT];
      const index = controls.getArray().indexOf(controlButton);
      if (index >= 0) controls.removeAt(index);
    };
  }, [map]);

  return null;
};

export default MyLocationControl;
