import React from "react";
import { useParams, useNavigate } from "react-router";
import {getDiscoveryById, deleteDiscovery}from '../../services/discoveryService'
import {useEffect,useState}from "react"
import './DiscoveryDetails.css'


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
      
        {!discovery ?(
          <p className="discovery-loading">Loading discovery . . .</p>
        ):(

            <div className="discovery-details-wrapper">
              <button 
              className="back-discovery-btn"
              onClick={()=>navigate('/all-discoveries')}
              >← Back to Discoveries</button>


              <div className="discovery-details-heading">
                <h1>Discovery <span>Details</span></h1>
                <p>Explore the full information about this discovery</p>
                </div>

                <div className="discovery-details-content">
            
<div className="discovery-image-card">
            {discovery.image ?
            (<img
            src={discovery.image}
            alt={discovery.title}
                />
            ):(
              <div className="no-discovery-image">
                No Image Available
        </div>
            )}
        </div>


        <div className="discovery-info-section">
          <div className="discovery-info-card">

            <h2>{discovery.title}</h2>
            <span className="discovery-type">
            {discovery.discoveryType}
            </span>

            <p className="discovery-description">
              {discovery.description}
            </p>


            <div className="discovery-meta">
              <div className="discovery-meta-item">
              <span>DISCOVERY DATE</span>
              <p>
                {new Date(discovery.discoveryDate).toDateString()}
              </p>
              </div>

              <div className="discovery-meta-item">
                <span>MISSION</span>
                <p>{discovery.mission?.title || 'No mission'}</p>
              </div>

              </div>
              </div>

              <div className="related-species-card">
                <h3>RELATED SPECIES</h3>

                <div className="related-species-list">
                  {discovery.species?.length> 0?(
                    discovery.species.map((item)=>(
                      <div className="related-species-item" key={item._id}>
                        <span>{item.scientificName}</span>
                        </div>
                    ))
                  ):(
                    <p>No related species</p>
                  )}

                </div>
              </div>

              <div className="discovery-actions">
                
  
      {canEdit && (
        <>
          <button  className='edit-discovery-btn' onClick={() => navigate(`/update-discovery/${id}`)}>
            Edit Discovery
          </button>
        </>
      )}
         {isAdmin &&(
         <button className="delete-discovery-btn" onClick={handleDelete}>Delete Discovery</button>

      )}

              </div>
              </div>
              </div>
              </div>


    )}
    </div>
  );
}

export default DiscoveryDetails;