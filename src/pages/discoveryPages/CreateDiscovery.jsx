import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createDiscovery} from '../../services/discoveryService';
import { getAllMissions } from '../../services/MissionService';
import { getAllSpecies } from '../../services/speciesService';
import './CreateDiscovery.css';

function CreateDiscovery() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discoveryType: '',
        discoveryDate: '',
        mission: '',
        species: '',
        image: '',
    });

    const [mission, setMission] = useState([]);
    const [species, setSpecies] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const missionData = await getAllMissions();
                const speciesData = await getAllSpecies();

                setMission(missionData);
                setSpecies(speciesData);
            } catch (err) {
                console.error(err);
            }
        };

        fetchOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const discoveryData = { ...formData };

            if (!discoveryData.image) {
                delete discoveryData.image;
            }

            const discovery = await createDiscovery(discoveryData);
            navigate(`/discovery/${discovery._id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='create-discovery-page'>
            <div className='create-discovery-container'>
            <h1 className='create-discovery-title'>Create Discovery</h1>
            <p className='create-discovery-subtitle'>Explore the Unknown</p>

            <form className='create-discovery-form' onSubmit={handleSubmit}>
                <div className='discovery-form-group'>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className='discovery-form-group'>

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                />
                </div>
                <div className='discovery-form-group'>

                <label htmlFor="discoveryType">Discovery Type</label>
                <select
                    id="discoveryType"
                    name="discoveryType"
                    value={formData.discoveryType}
                    onChange={handleChange}
                    required
>
    <option value="">Select discovery type</option>
    <option value="New Species">New Species</option>
    <option value="Geological Formation">Geological Formation</option>
    <option value="Shipwreck">Shipwreck</option>
    <option value="Ecosystem">Ecosystem</option>

</select>
</div>
               
<div className='discovery-form-group'>
                <label htmlFor="discoveryDate">Discovery Date</label>
                <input
                    id="discoveryDate"
                    name="discoveryDate"
                    type="date"
                    value={formData.discoveryDate}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className='discovery-form-group'>

                <label htmlFor="mission">Mission</label>
                <select
                    id="mission"
                    name="mission"
                    value={formData.mission}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a mission</option>
                    {mission.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.title}
                        </option>
                    ))}
                </select>
                </div>

                <div className='discovery-form-group'>

                <label htmlFor="species">Species</label>
                <select
                    id="species"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a species</option>
                    {species.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.scientificName}
                        </option>
                    ))}
                </select>
                </div>


             <div className='discovery-form-group'>
                <label htmlFor="image">Image URL</label>
                <input
                    id="image"
                    name="image"
                    type="text"
                    value={formData.image}
                    onChange={handleChange}
                    
                />
                </div>



                <button className='create-discovery-btn' type="submit">Create Discovery</button>
            </form>
        </div>
        </div>
    );
}

export default CreateDiscovery;
