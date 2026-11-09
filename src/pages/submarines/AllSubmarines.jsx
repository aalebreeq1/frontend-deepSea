import { useState, useEffect } from 'react';
import { getAllSubmarines } from '../../services/submarineService';
import { useNavigate } from 'react-router';
import { Button } from "@heroui/react";
import RecordFormModal from "../../components/RecordFormModal";

function AllSubmarines({ user }) {
  const [showCreate, setShowCreate] = useState(false);
  const canCreate = ["admin", "visitor"].includes(user?.role);
  const [submarines, setSubmarines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function fetchSubmarines() {
      try {
        const data = await getAllSubmarines();
        if (active) setSubmarines(data.submarines);
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message ||
            'Failed to load submarines. Please try again later.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchSubmarines();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1>All Submarines</h1>
      {canCreate && (
        <Button isDisabled={loading} onPress={() => setShowCreate(true)}>
          Create Submarine
        </Button>
      )}

      {canCreate && showCreate && (
        <RecordFormModal
          kind="submarine"
          user={user}
          onClose={() => setShowCreate(false)}
          onSaved={(submarine) => {
            setSubmarines((previous) => [...previous, submarine]);
            setError(null);
          }}
        />
      )}
      {loading ? (
        <p role="status">Loading submarines...</p>
      ) : error ? (
        <p role="alert" className="text-danger">{error}</p>
      ) : submarines.length === 0 ? (
        <p>No submarines currently registered.</p>
      ) : (
        submarines.map((submarine) => (
          <div key={submarine._id}>
            <span>{submarine.name}</span>
            <button
              onClick={() => navigate(`/submarines/${submarine._id}`)}
            >
              View
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AllSubmarines;
