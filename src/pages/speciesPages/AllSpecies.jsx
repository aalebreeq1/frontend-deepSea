import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllSpecies } from '../../services/speciesService';



function AllSpecies() {
    const [species, setSpecies] = useState([]);

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const data = await getAllSpecies();
                setSpecies(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSpecies();
    }, []);

    return (
        <div>
            <h1>All Species</h1>
            <Link to="/create-species">Create Species</Link>

            {species.length === 0 ? (
                <p>No species found.</p>
            ) : (
                <ul>
                    {species.map((item) => (
                        <li key={item._id}>
                            <Link to={`/species/${item._id}`}>
                                {item.scientificName}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AllSpecies;
