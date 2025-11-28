import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

const ResetView = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    // Find the existing zoom control container
    const zoomControl = document.querySelector('.leaflet-control-zoom');

    if (!zoomControl) return;

    // Create new button
    const btn = L.DomUtil.create(
      'a',
      'leaflet-control-zoom-reset',
      zoomControl
    );

    btn.innerHTML = '⟳';
    btn.href = '#';
    btn.title = 'Return to default view';

    // Match the styling of other buttons
    btn.classList.add('leaflet-control-zoom-in'); // apply same CSS dimensions

    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.fontSize = '28px';
    btn.style.fontWeight = 'bold';

    btn.onclick = e => {
      e.preventDefault();
      map.setView(center, zoom, { animate: true });
    };

    // Cleanup — remove only our button
    return () => {
      if (btn && zoomControl.contains(btn)) {
        zoomControl.removeChild(btn);
      }
    };
  }, [map, center, zoom]);

  return null;
};

export default ResetView;
