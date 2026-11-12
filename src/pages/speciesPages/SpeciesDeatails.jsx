import React from "react";
import { useParams, useNavigate } from "react-router";
import {getSpeciesById, deleteSpecies}from '../../services/speciesService'
import {useEffect,useState}from "react"
import './SpeciesDetails.css'


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
    <div className="species-details-page">
      { !species ?(
      <p className="species-loading">Loading species . . .</p>
      ):(
        <div className="species-details-wrapper">
      
        <button className="back-species-btn"
        onClick={()=> navigate('/all-species')}
        >Back to species</button>
        
        
            <div className="species-details-heading">
            <h1>Species Details</h1>
            <p>Explore Marine Life</p>
            </div>
            
            <div className="species-details-content">
              <div className="species-image-card">

            {species.image && (
                <img
                src={species.image}
                alt={species.scientificName}
                />

        )}
        </div>

        <div className="species-info-card">
          <div className="species-name">
            <h2>{species.scientificName}</h2>
            <p>{species.commonName}</p>
          </div>

          <div className="species-info-item">
            <span>CLASSIFICATION</span>
            <h3>{species.classification}</h3>
          </div>


          <div className="species-description">
            <h3>DESCRIPTION</h3>
            <p>{species.description}</p>
          </div>

          <div className="species-actions">
          {canEdit &&(
            <button className="edit-species-btn"
            onClick={() => navigate(`/update-species/${id}`)}
            >Edit Species</button>
          )}

          {isAdmin &&(
            <button className="delete-species-btn"
            onClick={handleDelete}>
              Delete Species
            </button>

          )}
        </div>
        </div>
        </div>
        </div>

)}
</div>

  );
}

export default SpeciesDetails;