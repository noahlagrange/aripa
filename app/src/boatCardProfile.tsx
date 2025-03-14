import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TAX, ADD_TAX_TO_BOAT } from "./query";

const Boat = ({ boat }: { boat: { id: number; name: string; type: string } }) => {
  const [createTax] = useMutation(CREATE_TAX);
  const [addTaxToBoat] = useMutation(ADD_TAX_TO_BOAT);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");

  const handleCreateTax = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { data } = await createTax({
        variables: {
          price: parseFloat(price),
          boatId: boat.id,
          date,
        },
      });

      const newTaxId = data.createTax.id;
      console.log("New tax", data.createTax);
      
      await addTaxToBoat({
        variables: {
          boatId: boat.id,
          taxId: newTaxId,
        },
      });

      setIsModalOpen(false);
      setPrice("");
      setDate("");
    } catch (error) {
      console.error("Error creating tax:", error);
    }
  };

  return (
    <div style={boatCardStyle}>
      <h3>{boat.name}</h3>
      <p>Type: {boat.type}</p>

      <button style={createTaxButtonStyle} onClick={() => setIsModalOpen(true)}>
        Create Tax
      </button>

      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setIsModalOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Create Tax</h2>
            <form onSubmit={handleCreateTax}>
              <label style={labelStyle}>
                Price (€):
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Date:
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={inputStyle}
                />
              </label>

              <div style={buttonContainerStyle}>
                <button type="submit" style={confirmButtonStyle}>Confirm</button>
                <button type="button" style={cancelButtonStyle} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boat;

const boatCardStyle: React.CSSProperties = {
  background: "#e0f7fa",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  width: "200px",
  textAlign: "center",
  position: "relative",
};

const createTaxButtonStyle: React.CSSProperties = {
  marginTop: "10px",
  padding: "10px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1rem",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  width: "300px",
  textAlign: "center",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  margin: "10px 0",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonContainerStyle: React.CSSProperties = {
  marginTop: "15px",
  display: "flex",
  justifyContent: "space-between",
};

const confirmButtonStyle: React.CSSProperties = {
  padding: "8px 12px",
  backgroundColor: "#0077cc",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  flex: 1,
  marginRight: "5px",
};

const cancelButtonStyle: React.CSSProperties = {
  padding: "8px 12px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  flex: 1,
  marginLeft: "5px",
};
