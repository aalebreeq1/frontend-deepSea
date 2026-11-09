import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllDiscoveries } from '../../services/discoveryService';



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
        <div>
            <h1>All Discoveries</h1>
            <Link to="/create-discovery">Create Discovery</Link>

            {discoveries.length === 0 ? (
                <p>No discoveries found.</p>
            ) : (
                <ul>
                    {discoveries.map((discovery) => (
                        <li key={discovery._id}>
                            <Link to={`/discovery/${discovery._id}`}>
                                {discovery.title}
                            </Link>
                            <p>Type: {discovery.discoveryType}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AllDiscovery;
