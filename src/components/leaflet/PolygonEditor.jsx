// PolygonEditor.jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';

const PolygonEditor = ({ onChange }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);

    // Handle polygon creation
    map.on(L.Draw.Event.CREATED, event => {
      // Remove any existing polygon
      drawnItems.clearLayers();

      const layer = event.layer;
      drawnItems.addLayer(layer);

      map.fitBounds(layer.getBounds(), { animate: true });

      if (onChange) onChange(layer.toGeoJSON());
    });

    // Handle polygon editing
    map.on(L.Draw.Event.EDITED, event => {
      event.layers.eachLayer(layer => {
        map.fitBounds(layer.getBounds(), { animate: true });

        if (onChange) onChange(layer.toGeoJSON());
      });
    });

    // Handle deletion
    map.on(L.Draw.Event.DELETED, () => {
      if (onChange) onChange(null);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onChange]);

  return null;
};

export default PolygonEditor;
