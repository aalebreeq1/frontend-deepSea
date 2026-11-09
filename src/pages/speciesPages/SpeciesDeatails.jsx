import React from "react";
import { useParams, useNavigate } from "react-router";
import {getSpeciesById, deleteSpecies}from '../../services/speciesServices'
import {useEffect,useState}from "react"

function SpeciesDetails({user}) {
  const navigate = useNavigate();
  const { id } = useParams();


  const [species, setSpecies] = useState(null);
  
  const isAdmin = user?.role === "admin";
  const canEdit = isAdmin || user?.role === "researcher";

  async function fetchSpecies() {
    const data = await getSpeciesById(id);
    setSpecies(data);
  }
  async function handleDelete() {
    await deleteSpecies(id);
    setSpecies(null);
    navigate("/all-species");
  }


  useEffect(() => {
    fetchSpecies();
  }, [id]);
  return (
    <div>
      SpeciesDetails
      {isAdmin &&(
         <button onClick={handleDelete}>Delete Species</button>

      )}
      {canEdit && (
        <>
          <button onClick={() => navigate(`/update-species/${id}`)}>
            Edit species
          </button>
        </>
      )}
      
        {species ?(
        
            <div>
            <h2>{species.scientificName}</h2>
            <p>CommonName:{species.commonName}</p>
            <p>Classification:{species.classification}</p>
            <p>Description:{species.description}</p>
            

            {species.image && (
                <img
                src={species.image}
                alt={species.scientificName}
                />

        )}
        </div>
        ):(
            <p>Loading . . .</p>
        )}
        </div>

    );
}

export default SpeciesDetails;