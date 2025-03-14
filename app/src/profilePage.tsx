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
  UPDATE_TAX
} from "./query";
import Boat from "./boatCardProfile";
import { IBoat, Tax } from "./graphqlTypes";
import CreateBoatForm from "./createBoatForm";
import { Link } from "react-router-dom";
import NavBar from "./navbar";


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
  const [selctedTax, setSelectedTax] = useState(0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhone, setEditedPhone] = useState("");

  const [showEditboatPopup, setShowEditboatPopup] = useState(false);
  const [editedBoatName, setEditedBoatName] = useState("");
  const [editedBoatType, setEditedBoatType] = useState("");

  const [showEdittaxPopup, setShowEdittaxPopup] = useState(false);
  const [editedTaxPrice, setEditedTaxPrice] = useState(0);
  const [editedTaxDate, setEditedTaxDate] = useState("");

  const handleUpdateTax = async () => {
    try {
      const { data } = await updateTax({
        variables: {
          id: selctedTax,
          price: editedTaxPrice,
          date: editedTaxDate,
        },
      });

      if (data?.updateTaxById) {
        const updatedTax = data.updateTaxById;
        setSelectedBoat(selectedBoat.map((tax) => (tax.id === updatedTax.id ? updatedTax : tax)));
        setShowEdittaxPopup(false);
      }
    } catch (error) {
      console.error("Error updating tax:", error);
    }
  }

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedEmail(user.email);
      setEditedPhone(user.phone);
    }
  }, [user]);


  const [updateBoat] = useMutation(UPDATE_BOAT);

  const [updateTax] = useMutation(UPDATE_TAX);

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
    <div>
      <NavBar />

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

              window.location.href = "/Home";
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
            <button
                onClick={() => {
                  setShowEdittaxPopup(true);
                  setSelectedTax(tax.id);
                  setEditedTaxPrice(tax.price);
                  setEditedTaxDate(tax.date);
                }}
                style={deleteButtonStyle}
              >
                Edit
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

      {/* Edit Tax Popup */}
      {showEdittaxPopup && (
        <div style={popupOverlayStyle}>
          <div style={popupContainerStyle}>
            <h2>Edit Tax</h2>
            <label>Price:</label>
            <input type="number" value={editedTaxPrice} onChange={(e) => setEditedTaxPrice(Number(e.target.value))} style={inputStyle} />
            <label>Date:</label>
            <input type="date" value={editedTaxDate} onChange={(e) => setEditedTaxDate(e.target.value)} style={inputStyle} />

            <div style={buttonContainerStyle}>
              <button onClick={handleUpdateTax} style={buttonStyle}>Save</button>
              <button onClick={() => setShowEdittaxPopup(false)} style={closeButtonStyle}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default UserProfile;


const taxItemStyle: React.CSSProperties = {
  marginBottom: "15px", 
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center", 
  gap: "70px",
};

const taxDataStyle: React.CSSProperties = {
  display: "flex",
  gap: "150px", 
  flex: 1,
  justifyContent: "center", 
  alignItems: "center",
};

const priceStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "18px",
};

const dateStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#666",
};

const boatStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#333",
};

const deleteButtonStyle: React.CSSProperties = {
  padding: "8px 14px", 
  fontSize: "14px",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer", 
  transition: "background-color 0.3s ease", 
};


const boatActionsContainerStyle: React.CSSProperties = {
  display: "flex",
  background: "#e0f7fa",
  gap: "10px",
  justifyContent: "center",
  marginBottom: "10px", 
};

const buttonStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  fontSize: "14px", 
  textAlign: "center", 
  border: "1px solid #ccc", 
  borderRadius: "4px", 
  backgroundColor: "#2196F3", 
  color: "#fff", 
};

const deleteBoatButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#f44336",
};

const boatListStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "15px",
  marginTop: "10px",
  fontFamily: "Arial, sans-serif",
};

const pageContainerStyle: React.CSSProperties = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f4f4f4",
  fontFamily: "Arial, sans-serif",
};

const headerStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#0077cc",
  color: "white",
  padding: "20px",
  textAlign: "center",
  fontSize: "1.5rem",
  fontFamily: "Arial, sans-serif",
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
  fontFamily: "Arial, sans-serif",
};

const boatsSectionStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  width: "45%",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
};

const loadingStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "#0077cc",
  fontFamily: "Arial, sans-serif",
};

const errorStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "red",
  fontFamily: "Arial, sans-serif",
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
  fontFamily: "Arial, sans-serif",
};

const taxesHeadingStyle: React.CSSProperties = {
  color: "#0077cc",
  fontSize: "1.5rem",
  marginBottom: "20px",
  fontFamily: "Arial, sans-serif",
};

const sectionHeadingStyle: React.CSSProperties = {
  color: "#0077cc",
  fontSize: "1.5rem",
  marginBottom: "20px",
  fontFamily: "Arial, sans-serif",
};

const taxesListStyle: React.CSSProperties = {
  listStyleType: "none",
  padding: 0,
  fontFamily: "Arial, sans-serif",
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
  fontFamily: "Arial, sans-serif",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontFamily: "Arial, sans-serif",
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
  fontFamily: "Arial, sans-serif",
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
  fontFamily: "Arial, sans-serif",
};
