import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

const RegionSelector = ({ regions }) => {
  const map = useMap();

  useEffect(() => {
    const div = L.DomUtil.create('select', 'leaflet-bar region-selector');

    div.style.padding = '4px';
    div.style.cursor = 'pointer';
    div.style.background = 'white';

    // add options
    Object.keys(regions).forEach(r => {
      const opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r;
      div.appendChild(opt);
    });

    // control
    const control = L.control({ position: 'topright' });

    control.onAdd = () => div;
    control.addTo(map);

    // change event
    div.onchange = () => {
      const region = regions[div.value];
      if (region) map.fitBounds(region, { animate: true });
    };

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
};

export default RegionSelector;
