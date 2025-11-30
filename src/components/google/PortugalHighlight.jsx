import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import portugalJson from "../../data/portugal.json";

const PortugalHighlight = () => {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;

    // --- Helper: Check if a ring is clockwise ---
    function isClockwise(points) {
      let sum = 0;
      for (let i = 0; i < points.length - 1; i++) {
        sum += (points[i + 1].lng - points[i].lng) * (points[i + 1].lat + points[i].lat);
      }
      return sum > 0;
    }

    // --- Convert Portugal coordinates to Google Maps LatLng ---
    const portugalRings = [];
    portugalJson.features.forEach((feature) => {
      const geom = feature.geometry;
      if (!geom) return;

      if (geom.type === "Polygon") {
        geom.coordinates.forEach((ring, idx) => {
          const latLngRing = ring.map(([lng, lat]) => ({ lat, lng }));
          const clockwise = isClockwise(latLngRing);
          portugalRings.push(idx === 0 ? (clockwise ? latLngRing : [...latLngRing].reverse()) : clockwise ? [...latLngRing].reverse() : latLngRing);
        });
      }

      if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach((poly) => {
          const ring = poly[0];
          const latLngRing = ring.map(([lng, lat]) => ({ lat, lng }));
          const clockwise = isClockwise(latLngRing);
          portugalRings.push(clockwise ? latLngRing : [...latLngRing].reverse());
        });
      }
    });

    // --- Full world outer ring ---
    const worldOuterRing = [
      { lat: 90, lng: -180 },
      { lat: 90, lng: 180 },
      { lat: -90, lng: 180 },
      { lat: -90, lng: -180 },
      { lat: 90, lng: -180 },
    ];

    // --- Mask: world with hole for Portugal ---
    const mask = new google.maps.Polygon({
      paths: [portugalRings],
      strokeOpacity: 0,
      //fillColor: '#f1c40f',
      //weight: 2,
      fillOpacity: 0,
      clickable: false,
      map,
      //zIndex: 1,
    });

    // --- Border for Portugal ---
    const border = new google.maps.Data({ map });
    border.addGeoJson(portugalJson);
    border.setStyle({
      fillOpacity: 0,
      strokeColor: "#42a5f5",
      strokeWeight: 2,
      clickable: false,
      zIndex: 9999,
    });

    return () => {
      mask.setMap(null);
      border.setMap(null);
    };
  }, [map]);

  return null;
};

export default PortugalHighlight;
