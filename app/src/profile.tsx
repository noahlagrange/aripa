import React from 'react';
import { User } from './graphqlTypes';

interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  
    
    if (user.boats == null) {
        return (
            <div style={cardStyle}>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <p>{user.phone}</p>
                <p>No boats</p>
            </div>
        );
    }
    return (

    <div style={cardStyle}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.phone}</p>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  background: '#f5f5f5',
  borderRadius: '8px',
  padding: '20px',
  margin: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '300px',
  textAlign: 'center',
};

export default ProfileCard;
