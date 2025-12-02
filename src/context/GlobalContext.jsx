import React, { createContext, useState } from 'react';
import portugalJson from '../data/portugal.json';
import markersJson from '../data/markers.json';

export const GlobalContext = createContext();

const GlobalProvider = props => {
  const [darkMode, setDarkMode] = useState(false);
  const [markers, setMarkers] = useState(markersJson);
  const [portugalGeo, setPortugalGeo] = useState(portugalJson);

  return (
    <GlobalContext.Provider
      value={{
        darkMode, 
        setDarkMode,
        markers, setMarkers, 
        portugalGeo, setPortugalGeo,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default React.memo(GlobalProvider);
