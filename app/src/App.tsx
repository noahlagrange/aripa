import React, { useState, useEffect } from 'react';
import './App.css';
import { useQuery } from '@apollo/client';
import { GET_USERS } from './query';
import { User } from './graphqlTypes';
import ProfileCard from './profile';
import CreateClientForm from './createClientForm';
import BoatApp from './BoatComponent';
import { Link } from "react-router-dom";
import NavBar from './navbar';

function App() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);

  const toggleForm = () => setIsFormVisible(!isFormVisible);
  const toggleShowAll = () => setShowAllUsers(!showAllUsers);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const usersToShow = showAllUsers ? data.users : data.users.slice(0, 4);

  return (
    <div>
      <NavBar />
      <div style={style}>
        <div style={bannerStyle}>
          <h1 style={bannerTextStyle}>Clients</h1>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={toggleForm} style={buttonStyle}>
            {isFormVisible ? 'Close Form' : 'Create New Client'}
          </button>

          {data.users.length > 4 && (
            <button onClick={toggleShowAll} style={seeMoreButtonStyle}>
              {showAllUsers ? 'See Less' : 'See More'}
            </button>
          )}
        </div>

        {isFormVisible && <CreateClientForm onClose={toggleForm} />}

        <div style={cardsContainerStyle}>
          {usersToShow.map((user: User) => (
            <Link to={`/user/${user.id}`} key={user.id} style={linkStyle}>
              <ProfileCard key={user.id} user={user} />
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
  height: '100vh',  
  justifyContent: 'center',
  fontSize: 'calc(10px + 2vmin)',
  backgroundColor: '#f0f8ff', 
  fontFamily: 'Arial, sans-serif',
  padding: '0',  
  margin: '0',  
};

const bannerStyle: React.CSSProperties = {
  width: '10%',  
  background: 'linear-gradient(45deg, #2196F3, #64B5F6)',
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
  backgroundColor: '#2196F3',  
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const buttonHoverStyle: React.CSSProperties = {
  backgroundColor: '#1976D2',  
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
  gridTemplateColumns: 'repeat(4, 1fr)',  
  gap: '25px',
  justifyContent: 'center',
  marginTop: '40px',
  flex: 1,  
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

export default App;
