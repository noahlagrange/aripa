import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_BOAT, ADD_BOAT_TO_USER } from './query';  // Import both mutations
import { User } from './graphqlTypes';

interface CreateBoatFormProps {
  onClose: () => void;
  users: User[];
}

const CreateBoatForm: React.FC<CreateBoatFormProps> = ({ onClose, users }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [ownerId, setOwnerId] = useState<string>(''); // Keep ownerId as string
  const [createBoat] = useMutation(CREATE_BOAT);
  const [addBoatToUser] = useMutation(ADD_BOAT_TO_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerId) {
      try {
        // Create the boat first
        const { data: boatData } = await createBoat({
          variables: { name: name, type: type, owner: parseInt(ownerId) }, // Ensure ownerId is a float
        });

        if (boatData) {
          console.log('Boat created:', boatData.createBoat);
          const boatId = boatData.createBoat.id;
          await addBoatToUser({
            variables: { userId: parseFloat(ownerId), boatId: parseFloat(boatData.createBoat.id) }, // Ensure both are floats
          });

          // Reset form fields and close the modal
          setName('');
          setType('');
          setOwnerId('');
          onClose();
        }
      } catch (err) {
        console.error('Error creating boat and assigning to user:', err);
      }
    } else {
      console.error('Please select a user.');
    }
  };

  return (
    <div style={popupOverlayStyle}>
      <div style={popupStyle}>
        <h2>Create New Boat</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Boat Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Boat Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            style={inputStyle}
          />
          <select
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            style={inputStyle}
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <div style={buttonContainerStyle}>
            <button type="submit" style={submitButtonStyle}>
              Submit
            </button>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const popupOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const popupStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '33%', // Set width to 1/3 of the screen width
  height: '33%', // Set height to 1/3 of the screen height
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  width: '100%',
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default CreateBoatForm;
