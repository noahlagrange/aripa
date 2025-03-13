import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  GET_USER_INFO,
  GET_ALL_USER_TAXES,
  GET_BOAT_TAXES,
  DELETE_TAX,
  DELETE_BOAT,
  UPDATE_USER,
  UPDATE_BOAT,
  DELETE_USER,
} from "./query";
import Boat from "./boatCardProfile";
import { IBoat, Tax } from "./graphqlTypes";
import CreateBoatForm from "./createBoatForm";
import { Link } from "react-router-dom";


const UserProfile = () => {
  const { userId } = useParams();
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [showCreateBoatForm, setShowCreateBoatForm] = useState(false);
  const client = useApolloClient();
  const [selectedBoat, setSelectedBoat] = useState<Tax[]>([]);
  const [selectedBoatId, setSelectedBoatId] = useState<number | null>(null);
  const [boats, setBoats] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [selectedBoatEdit, setSelectedBoatEdit] = useState(0);
  

  const { loading, error, data } = useQuery(GET_USER_INFO, {
    variables: { userId: Number(userId) },
  });

  useEffect(() => {
    setUser(data?.user);
    setBoats(data?.user?.boats);
  }, [data]);

  const [updateUser] = useMutation(UPDATE_USER);

  // State for Edit Profile Popup
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhone, setEditedPhone] = useState("");

  const [showEditboatPopup, setShowEditboatPopup] = useState(false);
  const [editedBoatName, setEditedBoatName] = useState("");
  const [editedBoatType, setEditedBoatType] = useState("");

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedEmail(user.email);
      setEditedPhone(user.phone);
    }
  }, [user]);


  const [updateBoat] = useMutation(UPDATE_BOAT);


  const deleteBoat = async (boatId: number) => {
    if (!boatId) {
      console.error("Invalid Boat ID");
      return;
    }
    try {
      setBoats(boats.filter((boat: any) => boat.id !== boatId));

      await client.mutate({
        mutation: DELETE_BOAT,
        variables: { id: boatId },
        fetchPolicy: "network-only",
      });
    } catch (error) {
      console.error("Error deleting boat:", error);
    }
  };

  const getBoatTaxes = async (boatId: number) => {
    try {
      setSelectedBoatId(boatId);
      const { data } = await client.query({
        query: GET_BOAT_TAXES,
        variables: { boatId },
        fetchPolicy: "network-only",
      });
      return data.BoatTaxes;
    } catch (error) {
      console.error("Error fetching boat taxes:", error);
      return [];
    }
  };

  const deleteTax = async (taxId: number) => {
    if (!taxId) {
      console.error("Invalid Tax ID");
      return;
    }
    try {
      setSelectedBoat(selectedBoat.filter((tax) => tax.id !== taxId));

      await client.mutate({
        mutation: DELETE_TAX,
        variables: { id: taxId },
        fetchPolicy: "network-only",
      });

      if (selectedBoatId === null) return;

      const boatTaxes = await getBoatTaxes(selectedBoatId);
      setSelectedBoat(boatTaxes);
    } catch (error) {
      console.error("Error deleting tax:", error);
    }
  };

  const onBoatClick = async (boatId: number) => {
    const boatTaxes = await getBoatTaxes(boatId);
    setSelectedBoat(boatTaxes || []);
  };
  const handleUpdateUser = async () => {
    try {
      const { data } = await updateUser({
        variables: {
          id: Number(userId),
          name: editedName,
          email: editedEmail,
          phone: editedPhone,
        },
      });

      if (data?.updateUser) {
        setUser(data.updateUser);
        setShowEditPopup(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleUpdateBoat = async () => {
    try {
      const { data } = await updateBoat({
        variables: {
          id: selectedBoatEdit,
          name: editedBoatName,
          type: editedBoatType,
        },
      });

      if (data?.updateBoat) {
        setBoats(
          boats.map((boat: any) =>
            boat.id === selectedBoatEdit ? { ...boat, name: editedBoatName, type: editedBoatType } : boat
          )
        );
        setShowEditboatPopup(false);
      }
    } catch (error) {
      console.error("Error updating boat:", error);
    }
  };


  const showAllTaxes = async () => {
    if (!user?.id) return;
    try {
      const { data } = await client.query({
        query: GET_ALL_USER_TAXES,
        variables: { userId: user.id },
        fetchPolicy: "network-only",
      });
      setSelectedBoat(data?.findUserBoatTaxes || []);
    } catch (error) {
      console.error("Error fetching all taxes:", error);
    }
  };

  if (loading) return <p style={loadingStyle}>Loading...</p>;
  if (error) return <p style={errorStyle}>Error: {error.message}</p>;
  if (!user) return <p style={errorStyle}>User not found.</p>;


  return (
    <div style={pageContainerStyle}>
      <header style={headerStyle}>
        <h1>{user.name}'s Profile</h1>
      </header>

      <main style={mainContainerStyle}>
        <div style={profileSectionStyle}>
          <h2 style={sectionHeadingStyle}>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <button onClick={() => setShowEditPopup(true)} style={editProfileButtonStyle}>
            Edit Profile
          </button>
            <button onClick={async () => {
            if (window.confirm("Are you sure you want to delete your account?")) {
              await client.mutate({
              mutation: DELETE_USER,
              variables: { id: Number(userId) },
              }).then(response => {
                console.log('Mutation response:', response);
              })
              .catch(error => {
                console.error('Error during mutation:', error);
              });;

              window.location.href = "/";
            }
            }} style={editProfileButtonStyle}>
            Delete Account
            </button>
        </div>

        <div style={boatsSectionStyle}>
          <h2 style={sectionHeadingStyle}>Boats Owned</h2>
          <button
            onClick={() => setShowCreateBoatForm(!showCreateBoatForm)}
            style={buttonStyle}
          >
            {showCreateBoatForm ? "Close Form" : "Add New Boat"}
          </button>

          {showCreateBoatForm && <CreateBoatForm users={[user]} onClose={() => setShowCreateBoatForm(false)} />}

          {boats.length > 0 ? (
            <div style={boatListStyle}>
              {boats.map((boat: any) => (
  <div key={boat.id} onClick={() => onBoatClick(boat.id)}>
    <div style={boatActionsContainerStyle}>
      <button
        onClick={() => {
          setShowEditboatPopup(true);
          setSelectedBoatEdit(boat.id);
          setEditedBoatName(boat.name);
          setEditedBoatType(boat.type);
        }}
        style={buttonStyle}
      >
        Edit Boat
      </button>
      <button
        onClick={() => deleteBoat(boat.id)}
        style={deleteBoatButtonStyle}
      >
        Delete Boat
      </button>
    </div>
    <Boat boat={boat} />
  </div>
))}
            </div>
          ) : (
            <p>No boats owned.</p>
          )}
        </div>
      </main>
        
      <div style={taxesCardContainerStyle}>
  <div style={taxesSectionStyle}>
    <h2 style={taxesHeadingStyle}>Taxes</h2>
    <button onClick={showAllTaxes} style={buttonStyle}>
      See All Taxes
    </button>
    {selectedBoat.length !== 0 ? (
      <ul style={taxesListStyle}>
        {selectedBoat.map((tax, index) => (
          <li key={index} style={taxItemStyle}>
            <div style={taxDataStyle}>
              <span style={priceStyle}>Price: ${tax.price}</span>
              <span style={dateStyle}>Date: {tax.date}</span>
              Boat:  {boats.find((boat) => boat.id === tax.boatId)?.name}
            <button onClick={() => deleteTax(tax.id)} style={deleteButtonStyle}>
              Delete
            </button>
            </div>

          </li>
        ))}
      </ul>
    ) : (
      <p>No taxes available.</p>
    )}
  </div>
      </div>
      {/* Edit Profile Popup */}
      {showEditPopup && (
        <div style={popupOverlayStyle}>
          <div style={popupContainerStyle}>
            <h2>Edit Profile</h2>
            <label>Name:</label>
            <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} style={inputStyle} />
            <label>Email:</label>
            <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} style={inputStyle} />
            <label>Phone:</label>
            <input type="text" value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} style={inputStyle} />

            <div style={buttonContainerStyle}>
              <button onClick={handleUpdateUser} style={buttonStyle}>Save</button>
              <button onClick={() => setShowEditPopup(false)} style={closeButtonStyle}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Boat Popup */}
      {showEditboatPopup && (
        <div style={popupOverlayStyle}>
          <div style={popupContainerStyle}>
            <h2>Edit Boat</h2>
            <label>Name:</label>
            <input type="text" value={editedBoatName} onChange={(e) => setEditedBoatName(e.target.value)} style={inputStyle} />
            <label>Type:</label>
            <input type="text" value={editedBoatType} onChange={(e) => setEditedBoatType(e.target.value)} style={inputStyle} />

            <div style={buttonContainerStyle}>
              <button onClick={handleUpdateBoat} style={buttonStyle}>Save</button>
              <button onClick={() => setShowEditboatPopup(false)} style={closeButtonStyle}>Cancel</button>
            </div>
          </div>
        </div>)
      }


    </div>
  );
};

export default UserProfile;


const taxItemStyle: React.CSSProperties = {
  marginBottom: "15px", // Space between tax items
  display: "flex",
  justifyContent: "space-between", // Distributes space evenly between elements
  alignItems: "center", // Align items vertically
  gap: "70px", // Sets 
};

const taxDataStyle: React.CSSProperties = {
  display: "flex",
  gap: "150px", // Space between price, date, and boat
  flex: 1, // Ensures that tax data takes all available space, pushing the delete button to the right
  justifyContent: "center", // Center the elements horizontally
  alignItems: "center", // Center the elements vertically
};

const priceStyle: React.CSSProperties = {
  fontWeight: "bold", // Makes the price bold
  fontSize: "18px", // Font size for the price
};

const dateStyle: React.CSSProperties = {
  fontSize: "16px", // Font size for the date
  color: "#666", // Lighter color for the date
};

const boatStyle: React.CSSProperties = {
  fontSize: "16px", // Font size for the boat name
  color: "#333", // Darker color for the boat name
};

const deleteButtonStyle: React.CSSProperties = {
  padding: "8px 14px", // Increased padding for the delete button
  fontSize: "14px", // Bigger font for the button
  backgroundColor: "#f44336", // Red background for the delete button
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer", // Makes it interactive
  transition: "background-color 0.3s ease", // Smooth transition for hover effect
};


const boatActionsContainerStyle: React.CSSProperties = {
  display: "flex",
  background: "#e0f7fa",
  gap: "10px", // Optional: adds space between buttons
  justifyContent: "center", // Center the buttons horizontally
  marginBottom: "10px", // Optional: space between buttons and the boat card
};

const buttonStyle: React.CSSProperties = {
  flex: 1, // Makes the button grow and fill the space equally
  padding: "10px", // You can adjust the padding to make the button look better
  fontSize: "14px", // Optional: control font size for consistency
  textAlign: "center", // Center the text in the button
  border: "1px solid #ccc", // Optional: style the border
  borderRadius: "4px", // Optional: adds rounded corners to the buttons
  backgroundColor: "#2196F3", // Blue background for the Edit button
  color: "#fff", // White text for contrast
};

const deleteBoatButtonStyle: React.CSSProperties = {
  ...buttonStyle, // Inherit common styles from buttonStyle
  backgroundColor: "#f44336", // Red background for delete button
};

const boatListStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "15px",
  marginTop: "10px",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const pageContainerStyle: React.CSSProperties = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f4f4f4",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const headerStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#0077cc",
  color: "white",
  padding: "20px",
  textAlign: "center",
  fontSize: "1.5rem",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const mainContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "80%",
  marginTop: "30px",
};

const profileSectionStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  width: "45%",
  textAlign: "center",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const boatsSectionStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  width: "45%",
  textAlign: "center",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const loadingStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "#0077cc",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const errorStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "red",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const taxesCardContainerStyle: React.CSSProperties = {
  width: "75%",
  display: "flex",
  justifyContent: "center",
  marginTop: "30px",
};

const taxesSectionStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  width: "80%",
  textAlign: "center",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const taxesHeadingStyle: React.CSSProperties = {
  color: "#0077cc",
  fontSize: "1.5rem",
  marginBottom: "20px",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const sectionHeadingStyle: React.CSSProperties = {
  color: "#0077cc",
  fontSize: "1.5rem",
  marginBottom: "20px",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const taxesListStyle: React.CSSProperties = {
  listStyleType: "none",
  padding: 0,
  fontFamily: "Arial, sans-serif", // Consistent font
};


const popupOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupContainerStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  width: "400px",
  textAlign: "center",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const buttonContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
};

const closeButtonStyle: React.CSSProperties = {
  backgroundColor: "#ccc",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontFamily: "Arial, sans-serif", // Consistent font
};

const editProfileButtonStyle: React.CSSProperties = {
  backgroundColor: "#0077cc",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1rem",
  marginTop: "20px",
  fontFamily: "Arial, sans-serif", // Consistent font
};
