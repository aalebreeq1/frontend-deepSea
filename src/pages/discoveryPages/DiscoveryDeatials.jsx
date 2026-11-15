import React from "react";
import { useParams, useNavigate } from "react-router";
import {getDiscoveryById, deleteDiscovery}from '../../services/discoveryService'
import {useEffect,useState}from "react"
import './DiscoveryDetails.css';

function DiscoveryDetails({user}) {
  const navigate = useNavigate();
  const { id } = useParams();


  const [discovery, setDiscovery] = useState(null);
  
  const isAdmin = user?.role === "admin";
  const canEdit = isAdmin || user?.role === "researcher";

  async function fetchDiscovery() {
    const data = await getDiscoveryById(id);
    setDiscovery(data);
  }
  async function handleDelete() {
    await deleteDiscovery(id);
    setDiscovery(null);
    navigate("/all-discoveries");
  }


  useEffect(() => {
    fetchDiscovery();
  }, [id]);
  return (
    <div className="discovery-details-page">
      <div className="discovery-details-container">


     <div className="discovery-details-header">
      <div>
        <p className="discovery-subtitle">EXPLORE THE UNKNOWN</p>
        <h1>Discovery Details</h1>
      </div>
     

      <div className="discovery-actions">
      {isAdmin &&(
         <button className="delete-btn"onClick={handleDelete}>Delete Discovery</button>

      )}
      {canEdit && (
        <>
          <button className="edit-btn" onClick={() => navigate(`/update-discovery/${id}`)}>
            Edit Discovery
          </button>
        </>
      )}
      </div>
      </div>
      
        {discovery ?(
        
            <div className="discovery-details-content">

              <div className="discovery-image-section">
                {discovery.image &&(
                  <img src={discovery.image} alt={discovery.title}/>
                  )}
                  </div>
               
               <div className="discovery-info-section">
            <h2>{discovery.title}</h2>

            <div className="discovery-description">
              <h3>Description</h3>
            <p>{discovery.description}</p>
            </div>


            <span className="discovery-type-badge">
            <p>Type:{discovery.discoveryType}</p>
            </span>

            <div className="discovery-info-grid">
              <div className="discovery-info-card">
                <span>Discovery Date</span>
            <p>{new Date(discovery.discoveryDate).toDateString()}</p>
            </div>
          
            <div className="discovery-info-card">
              <span>Mission</span>
            <p>{discovery.mission?.title || "NO mission assigned "}</p>
            </div>

            <div className="discovery-info-card">
              <span>Species</span>

            
            {discovery.species?.length> 0 ? (
            discovery.species.map((item)=>(
                <p key={item._id}>{item.scientificName}</p>
            ))
          ):(
            <p>No species assigned</p>
          )}
          </div>
          </div>

          </div>

        </div>
        ):(
            <p className="discovery-loading">Loading . . .</p>
        )}
        </div>
        </div>

    );

  
}

export default DiscoveryDetails;