import { useEffect, useRef, useContext } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { GlobalContext } from '../../context/GlobalContext';

const PolygonControl = ({ onChange }) => {
  const map = useMap();
  const drawingManagerRef = useRef(null);
  const drawnPolygonRef = useRef(null);
  const deleteButtonRef = useRef(null);

  const {
    darkMode, setDarkMode,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!map || !window.google) return;

    // --- Drawing Manager ---
    drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: '#4285F4',
        fillOpacity: 0.4,
        strokeColor: '#4285F4',
        strokeWeight: 2,
        clickable: true,
        editable: true,
      },
    });
    drawingManagerRef.current.setMap(map);

    // --- Polygon Button ---
    const polygonButton = document.createElement('div');
    polygonButton.innerHTML = `<i class="bi bi-pentagon-fill"></i>`;

    Object.assign(polygonButton.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      background: darkMode ? '#222' : '#fff',
      border: '2px solid #fff',
      borderRadius: '3px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      margin: '10px 1px',
      padding: '6px 12px',
      fontFamily: 'Roboto, Arial, sans-serif',
    });

    polygonButton.onclick = () => {
      const dm = drawingManagerRef.current;
      dm.setDrawingMode(
        dm.getDrawingMode()
          ? null
          : window.google.maps.drawing.OverlayType.POLYGON
      );
    };

    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
      polygonButton
    );

    // --- Delete Button ---
    const deleteButton = document.createElement('div');
    deleteButton.innerHTML = `<i class="bi bi-trash-fill"></i>`;

    Object.assign(deleteButton.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      background: darkMode ? '#222' : '#fff',
      border: '2px solid #fff',
      borderRadius: '3px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      cursor: 'not-allowed',
      opacity: '0.5',
      margin: '10px 1px',
      padding: '6px 12px',
      fontFamily: 'Roboto, Arial, sans-serif',
    });

    deleteButton.onclick = () => {
      if (!drawnPolygonRef.current) return;
      drawnPolygonRef.current.setMap(null);
      drawnPolygonRef.current = null;

      if (onChange) onChange(null);

      deleteButton.style.opacity = '0.5';
      deleteButton.style.cursor = 'not-allowed';
    };

    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
      deleteButton
    );
    deleteButtonRef.current = deleteButton;

    // --- Polygon Complete ---
    window.google.maps.event.addListener(
      drawingManagerRef.current,
      'polygoncomplete',
      polygon => {
        if (drawnPolygonRef.current)
          drawnPolygonRef.current.setMap(null);

        drawnPolygonRef.current = polygon;

        const bounds = new window.google.maps.LatLngBounds();
        polygon.getPath().forEach(latLng => bounds.extend(latLng));
        map.fitBounds(bounds);

        // Enable delete button
        deleteButton.style.opacity = '1';
        deleteButton.style.cursor = 'pointer';

        polygon.getPath().addListener('set_at', () => {
          if (onChange) onChange(convertPolygonToGeoJSON(polygon));
        });
        polygon.getPath().addListener('insert_at', () => {
          if (onChange) onChange(convertPolygonToGeoJSON(polygon));
        });

        if (onChange) onChange(convertPolygonToGeoJSON(polygon));

        drawingManagerRef.current.setDrawingMode(null);
      }
    );

    // --- Cleanup ---
    return () => {
      drawingManagerRef.current?.setMap(null);
      drawnPolygonRef.current?.setMap(null);

      [polygonButton, deleteButton].forEach(btn => {
        const arr = map.controls[window.google.maps.ControlPosition.TOP_LEFT];
        const idx = arr.getArray().indexOf(btn);
        if (idx >= 0) arr.removeAt(idx);
      });
    };
  }, [map, onChange]);

  return null;
};

// --- Convert polygon to GeoJSON ---
function convertPolygonToGeoJSON(polygon) {
  const path = polygon
    .getPath()
    .getArray()
    .map(latLng => [latLng.lng(), latLng.lat()]);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [path],
    },
    properties: {},
  };
}

export default PolygonControl;
