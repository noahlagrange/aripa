// NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <div style={navbarStyle}>
      <Link to="/Boat" style={linkStyle}>
        Boats
      </Link>
      <Link to="/Client" style={linkStyle}>
        Clients
      </Link>
    </div>
  );
}

const navbarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#333',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',  // Deeper shadow for a more elevated look
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '32px',  // Increased font size
  margin: '0 30px',  // Increased margin for more space between links
  padding: '15px 25px',  // Bigger padding for each link
  borderRadius: '8px',  // Slightly rounded corners for a more modern look
  fontWeight: '600',  // Slightly heavier font weight for better prominence
};

const hoverLinkStyle: React.CSSProperties = {
  backgroundColor: '#4CAF50',  // Green on hover
  transform: 'scale(1.05)',  // Slight zoom effect
};

export default NavBar;
