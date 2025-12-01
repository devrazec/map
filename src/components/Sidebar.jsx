import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';

const Sidebar = () => {
  return (
    <div className="sidebar bg-light border-end">
      <h4 className="p-3 fw-bold">Libraries</h4>

      <Nav vertical pills className="p-2">
        <NavItem>
          <NavLink href="#">
            <i className="bi bi-map-fill me-2"></i> Leaflet map
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="#">
            <i className="bi bi-map-fill me-2"></i> Google Map API
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default Sidebar;
