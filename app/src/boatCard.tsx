import React from 'react';
import { IBoat } from './graphqlTypes';

interface BoatCardProps {
  boat: IBoat;
}

const BoatCard: React.FC<BoatCardProps> = ({ boat }) => {
  return (
    <div style={cardStyle}>
      <h3>{boat.name}</h3>
      <p>Type: {boat.type}</p>
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

export default BoatCard;
