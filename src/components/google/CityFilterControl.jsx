import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const CityFilterControl = ({ onSelect }) => {
  const map = useMap();

  // Define bounds for each city (Google Maps LatLngBounds)
  const regions = {
    All: new google.maps.LatLngBounds(
      new google.maps.LatLng(37.0, -9.5), // SW
      new google.maps.LatLng(41.2, -7.5)  // NE
    ),
    Lisbon: new google.maps.LatLngBounds(
      new google.maps.LatLng(38.69, -9.25),
      new google.maps.LatLng(38.82, -9.05)
    ),
    Porto: new google.maps.LatLngBounds(
      new google.maps.LatLng(41.11, -8.74),
      new google.maps.LatLng(41.19, -8.53)
    ),
    Faro: new google.maps.LatLngBounds(
      new google.maps.LatLng(37.0, -8.1),
      new google.maps.LatLng(37.2, -7.8)
    ),
  };

  const cities = [
    { label: "All", value: "All" },
    { label: "Lisbon", value: "Lisbon" },
    { label: "Porto", value: "Porto" },
    { label: "Faro", value: "Faro" },
  ];

  useEffect(() => {
    if (!map) return;

    const select = document.createElement("select");

    // Button-like CSS for the dropdown
    select.style.background = "#fff";
    select.style.border = "2px solid #fff";
    select.style.borderRadius = "3px";
    select.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    select.style.cursor = "pointer";
    select.style.margin = "10px";
    select.style.padding = "6px 12px";
    select.style.fontSize = "18px";
    select.style.fontFamily = "Roboto, Arial, sans-serif";

    cities.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.value;
      opt.textContent = c.label;
      select.appendChild(opt);
    });

    select.onchange = (e) => {
      const city = e.target.value;

      if (city && regions[city]) {
        map.fitBounds(regions[city]); // Zoom/pan to selected city
      }

      if (onSelect) onSelect(city); // Notify parent component
    };

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(select);

    return () => {
      const arr = map.controls[google.maps.ControlPosition.TOP_LEFT];
      const idx = arr.getArray().indexOf(select);
      if (idx >= 0) arr.removeAt(idx);
    };
  }, [map, onSelect]);

  return null;
};

export default CityFilterControl;
