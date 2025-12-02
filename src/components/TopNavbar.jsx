import React, { useContext } from 'react';
import { Navbar, NavbarBrand, Button } from 'reactstrap';
import { GlobalContext } from '../context/GlobalContext';

const TopNavbar = () => {

    const { darkMode, setDarkMode } = useContext(GlobalContext);
  
  return (
    <Navbar
      className="px-3 shadow-sm"
      color={darkMode ? 'dark' : 'light'}
      light={!darkMode}
      dark={darkMode}
    >
      <NavbarBrand href="/">
        Multi-Location Maps Platform - Interact with markers, regions, and
        polygons on this enhanced Maps.
      </NavbarBrand>

      <Button
        color={darkMode ? 'secondary' : 'dark'}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? (
          <i className="bi bi-sun-fill"></i>
        ) : (
          <i className="bi bi-moon-stars-fill"></i>
        )}
      </Button>
    </Navbar>
  );
};

export default TopNavbar;
