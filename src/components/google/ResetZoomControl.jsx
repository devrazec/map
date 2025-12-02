import { useEffect, useContext } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { GlobalContext } from '../../context/GlobalContext';

const ResetZoomControl = ({
  defaultCenter = { lat: 39.3999, lng: -8.2245 }, // Center of Portugal
  defaultZoom = 7,
}) => {
  const map = useMap();

  const {
    darkMode, setDarkMode,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!map) return;

    const controlButton = document.createElement('div');
    controlButton.innerHTML = `<i class="bi bi-arrow-counterclockwise"></i>`;

    // CSS
    controlButton.style.display = 'flex';
    controlButton.style.alignItems = 'center';
    controlButton.style.justifyContent = 'center';
    controlButton.style.fontSize = '20px';

    controlButton.style.background = darkMode ? '#222' : '#fff';
    controlButton.style.color = darkMode ? '#eee' : '#000';
    controlButton.style.border = darkMode ? '2px solid #444' : '2px solid #fff';
    controlButton.style.borderRadius = '3px';
    controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    controlButton.style.cursor = 'pointer';
    controlButton.style.margin = '10px';
    controlButton.style.padding = '6px 12px';
    controlButton.style.fontFamily = 'Roboto, Arial, sans-serif';

    // Reset logic
    controlButton.onclick = () => {
      map.panTo(defaultCenter);
      map.setZoom(defaultZoom);
    };

    // Add button to map control panel
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlButton);

    // Cleanup on component unmount
    return () => {
      const arr = map.controls[google.maps.ControlPosition.TOP_LEFT];
      const idx = arr.getArray().indexOf(controlButton);
      if (idx >= 0) arr.removeAt(idx);
    };
  }, [map, defaultCenter, defaultZoom]);

  return null;
};

export default ResetZoomControl;
