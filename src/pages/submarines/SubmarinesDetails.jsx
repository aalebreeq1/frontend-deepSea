import React from "react";
import { useParams, useNavigate } from "react-router";
import {
  getSubmarineById,
  deleteSubmarine,
  updateSubmarineState,
} from "../../services/submarineService";
import { useEffect, useState } from "react";
function SubmarinesDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [submarine, setSubmarine] = useState(null);
  const isAdmin = user?.role === "admin";
  const canEdit = isAdmin || user?.role === "researcher";

  async function fetchSubmarine() {
    const data = await getSubmarineById(id);
    setSubmarine(data);
  }
  async function handleDelete() {
    await deleteSubmarine(id);
    setSubmarine(null);
    navigate("/submarines");
  }

  async function handleUpdateState(newState) {
    const updatedSubmarine = await updateSubmarineState(id, newState);
    setSubmarine(updatedSubmarine);
  }
  useEffect(() => {
    fetchSubmarine();
  }, [id]);
  return (
    <div>
      SubmarinesDetails
      {canEdit && (
        <>
          <button onClick={handleDelete}>Delete Submarine</button>
          <button onClick={() => navigate(`/update-submarines/${id}`)}>
            Edit Submarine
          </button>
        </>
      )}
      {isAdmin && submarine && submarine.status === "operational" && (
        <>
          <button onClick={() => handleUpdateState("under_maintenance")}>
            Set Under Maintenance
          </button>
          <button onClick={() => handleUpdateState("retired")}>
            Set Retired
          </button>
        </>
      )}
      {isAdmin && submarine && submarine.status === "under_maintenance" && (
        <button onClick={() => handleUpdateState("operational")}>
          Set Operational
        </button>
      )}
      {!submarine ? <p>there is no submarine</p> : null}
      {submarine ? (
        <div>
          <h2>{submarine.name}</h2>
          <p>Model: {submarine.model}</p>
          <p>Max Depth: {submarine.maxDepth}</p>
          <p>Capacity: {submarine.capacity}</p>
          <p>Status: {submarine.status}</p>
          <p>Description: {submarine.description}</p>
          <img src={submarine.image} alt={submarine.name} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SubmarinesDetails;
