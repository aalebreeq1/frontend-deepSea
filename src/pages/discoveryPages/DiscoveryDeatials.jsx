import React from "react";
import { useParams, useNavigate } from "react-router";
import {getDiscoveryById, deleteDiscovery}from '../../services/discoveryService'
import {useEffect,useState}from "react"

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
    <div>
      DiscoveryDetails
      {isAdmin &&(
         <button onClick={handleDelete}>Delete Discovery</button>

      )}
      {canEdit && (
        <>
          <button onClick={() => navigate(`/update-discovery/${id}`)}>
            Edit Discovery
          </button>
        </>
      )}
      
        {discovery ?(
        
            <div>
            <h2>{discovery.title}</h2>
            <p>Description:{discovery.description}</p>
            <p>Type:{discovery.discoveryType}</p>
            <p>Date:{new Date(discovery.discoveryDate).toDateString()}</p>
            <p>Mission:{discovery.mission?.title}</p>
            <p>Species:</p>

            {discovery.species?.map((item)=>(
                <p key={item._id}>{item.scientificName}</p>
            ))}

            {discovery.image &&(<img
            src={discovery.image}
            alt={discovery.title}
                />

        )}
        </div>
        ):(
            <p>Loading . . .</p>
        )}
        </div>

    );
}

export default DiscoveryDetails;