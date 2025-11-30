import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const WORLD_OUTER_RING = [
  [-90, -180],
  [90, -180],
  [90, 180],
  [-90, 180],
  [-90, -180],
];



export default function DarkMask() {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;

    const maskData = new google.maps.Data({ map });





    // World polygon with Portugal holes
    const maskFeature = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [WORLD_OUTER_RING],
      },
    };

    const border = new google.maps.Data({ map });
    border.addGeoJson(portugalJson);
    border.setStyle({
      fillOpacity: 0,
      strokeColor: "#42a5f5",
      strokeWeight: 2,
      clickable: false,
      zIndex: 9999,
    });

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
