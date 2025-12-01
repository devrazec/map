import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import portugalJson from "../../data/portugal.json";

const WORLD_OUTER_RING = [
  [-90, -180],
  [90, -180],
  [90, 180],
  [-90, 180],
  [-90, -180],
];

function ensureCCW(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    sum += (x2 - x1) * (y2 + y1);
  }
  return sum > 0 ? ring : ring.slice().reverse();
}

export default function DarkMask() {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;

    const maskData = new google.maps.Data({ map });

    const portugalHoles = [];

    portugalJson.features.forEach((feature) => {
      const geom = feature.geometry;
      if (!geom) return;

      if (geom.type === "Polygon") {
        const ring = geom.coordinates[0];
        portugalHoles.push(ensureCCW(ring));
      }

      if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach((poly) => {
          const ring = poly[0];
          portugalHoles.push(ensureCCW(ring));
        });
      }
    });

    // World polygon with Portugal holes
    const maskFeature = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [WORLD_OUTER_RING, ...portugalHoles],
      },
    };

    maskData.addGeoJson(maskFeature);

    maskData.setStyle({
      color: 'black',
      fillColor: 'black',
      fillOpacity: 0.35,
      strokeWeight: 0,
      clickable: false,
    });

    return () => maskData.setMap(null);
  }, [map]);

  return null;
}
