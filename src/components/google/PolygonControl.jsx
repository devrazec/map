import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import portugalGeo from "../../data/portugal.json";

const PolygonControl = ({ onChange }) => {
  const map = useMap();
  const drawingManagerRef = useRef(null);
  const drawnPolygonRef = useRef(null);
  const maskPolygonRef = useRef(null);
  const deleteButtonRef = useRef(null);

  useEffect(() => {
    if (!map || !window.google) return;

    // --- 1. Create Portugal mask ---
    const portugalCoords = portugalGeo.features[0].geometry.coordinates[0].map(
      ([lng, lat]) => ({ lat, lng })
    );

    const maskPath = [
      { lat: 90, lng: -180 },
      { lat: 90, lng: 180 },
      { lat: -90, lng: 180 },
      { lat: -90, lng: -180 },
      { lat: 90, lng: -180 },
      ...portugalCoords,
    ];

    maskPolygonRef.current = new window.google.maps.Polygon({
      paths: [maskPath],
      strokeColor: "black",
      strokeOpacity: 0,
      strokeWeight: 0,
      fillColor: "black",
      fillOpacity: 0.3,
      clickable: false,
      geodesic: true,
    });
    maskPolygonRef.current.setMap(map);

    // --- 2. Create Drawing Manager ---
    drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: "#4285F4",
        fillOpacity: 0.4,
        strokeColor: "#4285F4",
        strokeWeight: 2,
        clickable: true,
        editable: true,
      },
    });
    drawingManagerRef.current.setMap(map);

    // --- 3. Create Polygon Button ---
    const polygonButton = document.createElement("div");
    polygonButton.innerHTML = `<i class="bi bi-pentagon-fill"></i>`;
    styleControlButton(polygonButton);

    polygonButton.onclick = () => {
      const dm = drawingManagerRef.current;
      dm.setDrawingMode(
        dm.getDrawingMode() ? null : window.google.maps.drawing.OverlayType.POLYGON
      );
    };

    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(polygonButton);

    // --- 4. Create Delete Button (always visible but disabled initially) ---
    const deleteButton = document.createElement("div");
    deleteButton.innerHTML = `<i class="bi bi-trash-fill"></i>`;
    styleControlButton(deleteButton);
    setDeleteButtonDisabled(deleteButton, true); // initially disabled

    deleteButton.onclick = () => {
      if (!drawnPolygonRef.current) return;
      drawnPolygonRef.current.setMap(null);
      drawnPolygonRef.current = null;
      if (onChange) onChange(null);
      setDeleteButtonDisabled(deleteButton, true); // disable after deletion
    };

    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(deleteButton);
    deleteButtonRef.current = deleteButton;

    // --- 5. Polygon complete event ---
    window.google.maps.event.addListener(
      drawingManagerRef.current,
      "polygoncomplete",
      (polygon) => {
        // Remove previous polygon
        if (drawnPolygonRef.current) drawnPolygonRef.current.setMap(null);
        drawnPolygonRef.current = polygon;

        // Fit map to polygon
        const bounds = new window.google.maps.LatLngBounds();
        polygon.getPath().forEach((latLng) => bounds.extend(latLng));
        map.fitBounds(bounds);

        // Enable delete button
        setDeleteButtonDisabled(deleteButton, false);

        // Listen for edits
        polygon.getPath().addListener("set_at", () => {
          if (onChange) onChange(convertPolygonToGeoJSON(polygon));
        });
        polygon.getPath().addListener("insert_at", () => {
          if (onChange) onChange(convertPolygonToGeoJSON(polygon));
        });

        if (onChange) onChange(convertPolygonToGeoJSON(polygon));

        // Disable drawing after creation
        drawingManagerRef.current.setDrawingMode(null);
      }
    );

    // --- Cleanup ---
    return () => {
      drawingManagerRef.current?.setMap(null);
      drawnPolygonRef.current?.setMap(null);
      maskPolygonRef.current?.setMap(null);

      [polygonButton, deleteButton].forEach((btn) => {
        const arr = map.controls[window.google.maps.ControlPosition.TOP_LEFT];
        const idx = arr.getArray().indexOf(btn);
        if (idx >= 0) arr.removeAt(idx);
      });
    };
  }, [map, onChange]);

  return null;
};

// --- Helper: Convert Google Maps Polygon to GeoJSON ---
function convertPolygonToGeoJSON(polygon) {
  const path = polygon
    .getPath()
    .getArray()
    .map((latLng) => [latLng.lng(), latLng.lat()]);
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [path],
    },
    properties: {},
  };
}

// --- Helper: Style control buttons ---
function styleControlButton(button) {
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.fontSize = "20px";
  button.style.background = "#fff";
  button.style.border = "2px solid #fff";
  button.style.borderRadius = "3px";
  button.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  button.style.cursor = "pointer";
  button.style.margin = "10px 1px";
  button.style.padding = "6px 12px";
  button.style.fontFamily = "Roboto, Arial, sans-serif";
}

// --- Helper: Enable/Disable delete button ---
function setDeleteButtonDisabled(button, disabled) {
  if (!button) return;
  if (disabled) {
    button.style.opacity = "0.5";
    button.style.cursor = "not-allowed";
    button.onclickDisabled = true;
  } else {
    button.style.opacity = "1";
    button.style.cursor = "pointer";
    button.onclickDisabled = false;
  }
}

export default PolygonControl;