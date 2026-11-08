import { useState, useEffect } from 'react';
import { getAllSubmarines } from '../../services/submarineService';
import { useNavigate } from 'react-router';
import React from 'react';

function AllSubmarines() {
  const [submarines, setSubmarines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubmarines() {
      try {
        setLoading(true);
        const data = await getAllSubmarines();
        setSubmarines(data.submarines);
      } catch (err) {
        setError('Failed to load submarines. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmarines();
  }, []);

  if (loading) return <div>Loading submarines...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>All Submarines</h1>
      {submarines.length === 0 ? (
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