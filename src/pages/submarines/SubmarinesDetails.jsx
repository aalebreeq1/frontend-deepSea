import { Link, useParams, useNavigate } from "react-router";
import {
  getSubmarineById,
  deleteSubmarine,
  updateSubmarineState,
} from "../../services/submarineService";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import RecordFormModal from "../../components/RecordFormModal";
function SubmarinesDetails({ user }) {
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [submarine, setSubmarine] = useState(null);
  const [pending, setPending] = useState(false);
  const isAdmin = user?.role === "admin";
  const canDelete = isAdmin || user?.role === "visitor";
  const canEdit = isAdmin || user?.role === "researcher";

  async function handleDelete() {
    if (!canDelete || pending) return;

    setPending(true);

    try {
      await deleteSubmarine(id);
      navigate("/all-submarines");
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  }

  async function handleUpdateState(newState) {
    if (!canEdit || pending) return;

    setPending(true);

    try {
      const data = await updateSubmarineState(id, newState);
      setSubmarine(data.submarine);
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  }
  useEffect(() => {
    let active = true;

    async function fetchSubmarine() {
      try {
        const data = await getSubmarineById(id);
        if (active) setSubmarine(data.submarine);
      } catch (err) {
        console.error(err);
      }
    }

    fetchSubmarine();

    return () => {
      active = false;
    };
  }, [id]);

  if (!submarine || submarine._id !== id) {
    return (
      <div>
        <Link to="/all-submarines">Back to submarines</Link>
        <p role="status">Loading submarine...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Submarine Details</h1>
      <Link to="/all-submarines">Back to submarines</Link>

      {pending && <p role="status">Saving changes...</p>}

      {canDelete && (
        <button disabled={pending} onClick={handleDelete}>
          Delete Submarine
        </button>
      )}

      {canEdit && submarine && (
        <Button isDisabled={pending} onPress={() => setShowEdit(true)}>
          Edit Submarine
        </Button>
      )}

      {canEdit && submarine && showEdit && (
        <RecordFormModal
          key={submarine._id}
          kind="submarine"
          user={user}
          record={submarine}
          onClose={() => setShowEdit(false)}
          onSaved={setSubmarine}
        />
      )}
      {canEdit && submarine.status === "operational" && (
        <>
          <Button
            variant="secondary"
            isDisabled={pending}
            onPress={() => handleUpdateState("under_maintenance")}
          >
            Set Under Maintenance
          </Button>
          <Button
            variant="secondary"
            isDisabled={pending}
            onPress={() => handleUpdateState("retired")}
          >
            Set Retired
          </Button>
        </>
      )}

      {canEdit && submarine.status === "under_maintenance" && (
        <Button
          variant="secondary"
          isDisabled={pending}
          onPress={() => handleUpdateState("operational")}
        >
          Set Operational
        </Button>
      )}

      <div>
        <h2>{submarine.name}</h2>
        <p>Model: {submarine.model}</p>
        <p>Max Depth: {submarine.maxDepth}</p>
        <p>Capacity: {submarine.capacity}</p>
        <p>Status: {submarine.status}</p>
        <p>Description: {submarine.description}</p>
        {submarine.image && <img src={submarine.image} alt={submarine.name} />}
      </div>
    </div>
  );
}

export default SubmarinesDetails;
