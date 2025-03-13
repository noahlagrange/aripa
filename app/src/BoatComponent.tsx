import React, { useState, useEffect } from 'react';
import './App.css';
import { useQuery } from '@apollo/client';
import { GET_BOATS, GET_USERS } from './query';
import { IBoat } from './graphqlTypes';
import BoatCard from './boatCard';
import CreateBoatForm from './createBoatForm';
import { User } from './graphqlTypes';
import NavBar from './navbar';
import { Link } from "react-router-dom";

function BoatApp() {
  const { loading: loadingUsers, error: errorUsers, data: usersData } = useQuery(GET_USERS);
  const userslist = usersData?.users;

  const { loading, error, data, refetch } = useQuery(GET_BOATS);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showAllBoats, setShowAllBoats] = useState(false);

  const toggleForm = () => setIsFormVisible(!isFormVisible);
  const toggleShowAll = () => setShowAllBoats(!showAllBoats);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const boatsToShow = showAllBoats ? data.boats : data.boats.slice(0, 4);

  return (
    <div>
      <NavBar />
      <div style={style}>
        <div style={bannerStyle}>
          <h1 style={bannerTextStyle}>Boats</h1>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={toggleForm} style={buttonStyle}>
            {isFormVisible ? 'Close Form' : 'Create New Boat'}
          </button>

          {data.boats.length > 4 && (
            <button onClick={toggleShowAll} style={seeMoreButtonStyle}>
              {showAllBoats ? 'See Less' : 'See More'}
            </button>
          )}
        </div>

        {isFormVisible && <CreateBoatForm onClose={toggleForm} users={userslist} />}

        <div style={cardsContainerStyle}>
          {boatsToShow.map((boat: IBoat) => (
            <Link to={`/user/${boat.owner}`} key={boat.id} style={linkStyle}>
            <BoatCard key={boat.id} boat={boat} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100vh',  // Full height of the viewport
  justifyContent: 'center',
  fontSize: 'calc(10px + 2vmin)',
  backgroundColor: '#f0f8ff',  // Light blue background
  fontFamily: 'Arial, sans-serif',
  padding: '0',  // Remove any default padding
  margin: '0',  // Remove any default margin
};

const bannerStyle: React.CSSProperties = {
  width: '10%',  // Full width
  background: 'linear-gradient(45deg, #2196F3, #64B5F6)',  // Gradient with blue shades
  color: 'white',
  textAlign: 'center',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
};

const bannerTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '36px',
  fontWeight: '600',
  textTransform: 'uppercase',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '70%',
  padding: '10px',
  marginTop: '30px',
};

const buttonStyle: React.CSSProperties = {
  padding: '14px 28px',
  fontSize: '16px',
  backgroundColor: '#2196F3',  // Blue button color
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const buttonHoverStyle: React.CSSProperties = {
  backgroundColor: '#1976D2',  // Darker blue on hover
  transform: 'scale(1.05)',
};

const seeMoreButtonStyle: React.CSSProperties = {
  padding: '14px 28px',
  fontSize: '16px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const seeMoreButtonHoverStyle: React.CSSProperties = {
  backgroundColor: '#1976D2',
  transform: 'scale(1.05)',
};

const cardsContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',  // 4 columns in the grid
  gap: '25px',
  justifyContent: 'center',
  marginTop: '40px',
  flex: 1,  // Ensure it takes remaining space if needed
};


const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: 'inherit',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
};

const hoverCardStyle: React.CSSProperties = {
  transition: 'transform 0.3s ease',
};

export default BoatApp;
