import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {

  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = '/';
  }

  const disconnect = () => {
    localStorage.removeItem('isLoggedIn');
  };
  return (
    <div style={navbarStyle}>
      <Link to="/Boat" style={linkStyle}>
        Boats
      </Link>
      <Link to="/Client" style={linkStyle}>
        Clients
      </Link>
      <Link to="/" style={linkStyle} onClick={disconnect}>
        disconnect
      </Link>
    </div>
  );
}

const navbarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#333',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',  
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '32px',  
  margin: '0 30px',  
  padding: '15px 25px', 
  borderRadius: '8px',  
  fontWeight: '600',  
};

const hoverLinkStyle: React.CSSProperties = {
  backgroundColor: '#4CAF50',  
  transform: 'scale(1.05)', 
};

export default NavBar;
