import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import portugalJson from "../../data/portugal.json";

const PortugalHighlight = () => {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;

    // Collect all Portugal coordinates
    const portugalHoles = [];
    
    portugalJson.features.forEach((feature) => {
      const geom = feature.geometry;
      if (!geom) return;

      if (geom.type === "Polygon") {
        // Take only the outer ring (first ring)
        const ring = geom.coordinates[0].map(([lng, lat]) => ({ lat, lng }));
        portugalHoles.push(ring);
      }

      if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach((poly) => {
          // Take only the outer ring of each polygon
          const ring = poly[0].map(([lng, lat]) => ({ lat, lng }));
          portugalHoles.push(ring);
        });
      }
    });

    // Create world outer boundary - clockwise
    const worldRing = [
      { lat: 85, lng: -180 },
      { lat: 85, lng: 180 },
      { lat: -85, lng: 180 },
      { lat: -85, lng: -180 },
      { lat: 85, lng: -180 },
    ];

    // Portugal holes stay as-is (counter-clockwise)
    const reversedHoles = portugalHoles;

    // Create mask polygon
    const mask = new google.maps.Polygon({
      paths: [worldRing, ...reversedHoles],
      strokeOpacity: 0,
      fillColor: '#000000',
      fillOpacity: 0.65,
      clickable: false,
      map,
      zIndex: 1,
    });

    // Add Portugal border
    const border = new google.maps.Data({ map });
    border.addGeoJson(portugalJson);
    border.setStyle({
      fillOpacity: 0,
      strokeColor: "#42a5f5",
      strokeWeight: 3,
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