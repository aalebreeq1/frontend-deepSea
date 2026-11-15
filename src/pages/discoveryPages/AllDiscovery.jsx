import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllDiscoveries } from '../../services/discoveryService';
import "./AllDiscovery.css"


function AllDiscovery() {
    const [discoveries, setDiscoveries] = useState([]);

    useEffect(() => {
        const fetchDiscoveries = async () => {
            try {
                const data = await getAllDiscoveries();
                setDiscoveries(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDiscoveries();
    }, []);

    return (
        <div className='all-discoveries-page'>
            <div className='discoveries-header'>
                <div>
                    <span className='discoveries-label'>
                        BENEATH THE SURFACE
                    </span>
                    <h1>All Discoveries</h1>
                    <p>Explore the unknown depths of our oceans</p>
                    </div>
                   
                    
            <Link to="/create-discovery" className='create-discovery-link'>+ Create Discovery</Link> 
            </div>

            {discoveries.length === 0 ? (

                <div className='discoveries-empty'>
                <h2>No discoveries found.</h2>
                <p>There are no discoveries available yet</p>
                </div>
            ) : (
                <div className='discoveries-list'>
                    {discoveries.map((discovery) => (
                        <article className='discovery-card' key={discovery._id}>

                            {discovery.image ?(
                                <img src={discovery.image} alt={discovery.title} className='discovery-card-image'/>


                            ):(
                                <div className='discovery-card-placeholder'>
                                    DEEPSEA
                                    </div>

                            )}
                            <div className='discovery-card-content'>
                                <span className='discovery-type-badge'>
                                    {discovery.discoveryType}
                                </span>

                                <h2>{discovery.title}</h2>
                                <p>{discovery.description}</p>

                                <div className='discovery-card-footer'>
                                    <span>
                                        {discovery.discoveryDate 
                                        ?new Date(discovery.discoveryDate).toLocaleDateString()
                                        :'Date unavailable'}
                                    </span>


                                    <Link to={`/discovery/${discovery._id}`}
                                         className='view-discovery-link'>
                                    Explore Discovery →</Link>


                                    </div>
                                    </div>
                                    </article>
                    ))}
                    </div>
            )}

                                    </div>
    );  
}                              
                    
export default AllDiscovery;
