import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import portugalGeo from '../../data/portugal.json';

const MaskLayer = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const geom = portugalGeo.features[0].geometry;

    const polygons = [];

    if (geom.type === 'Polygon') {
      // Single polygon (only mainland)
      const coords = geom.coordinates[0].map(([lng, lat]) => ({
        lat,
        lng,
      }));
      polygons.push(coords);
    } else if (geom.type === 'MultiPolygon') {
      // Mainland + islands
      geom.coordinates.forEach(poly => {
        const coords = poly[0].map(([lng, lat]) => ({
          lat,
          lng,
        }));
        polygons.push(coords);
      });
    }

    const highlight = new google.maps.Polygon({
      paths: polygons,
      strokeColor: '#00BFFF', // border color
      strokeWeight: 3,
      fillColor: '#00BFFF',
      fillOpacity: 0.25, // soft highlight
      map,
    });

    return () => highlight.setMap(null);
  }, [map]);

  return null;
};

export default MaskLayer;
