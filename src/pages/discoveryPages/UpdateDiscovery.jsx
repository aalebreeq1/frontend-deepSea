import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getDiscoveryById, updateDiscovery } from '../../services/discoveryService';
import { getAllMissions } from '../../services/MissionService';
import { getAllSpecies } from '../../services/speciesService';

function UpdateDiscovery() {
    const navigate = useNavigate();
    const { id } = useParams();

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
                const discoveryData=await getDiscoveryById(id);

                setMission(missionData);
                setSpecies(speciesData);


                setFormData({
                    title: discoveryData.title,
                    description: discoveryData.description,
                    discoveryType: discoveryData.discoveryType,
                    discoveryDate: discoveryData.discoveryDate.split('T')[0],
                    mission: discoveryData.mission?._id || '',
                    species: discoveryData.species?.[0]?._id || '',
                    image: discoveryData.image || ''
                })
            } catch (err) {
                console.error(err);
            }
        };

        fetchOptions();
    }, [id]);

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
            const discoveryData = { ...formData,
                species:formData.species?[formData.species]:[]
             };

            if (!discoveryData.image) {
                delete discoveryData.image;
            }

            await updateDiscovery(id, discoveryData);
            navigate(`/discovery/${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Update Discovery</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="description">Description</label>
                <input
                    id="description"
                    name="description"
                    type="text"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="discoveryType">Discovery Type</label>
                <select
                    id="discoveryType"
                    name="discoveryType"
                    type="text"
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


                <label htmlFor="discoveryDate">Discovery Date</label>
                <input
                    id="discoveryDate"
                    name="discoveryDate"
                    type="date"
                    value={formData.discoveryDate}
                    onChange={handleChange}
                    required
                />

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


                <label htmlFor="image">Image URL</label>
                <input
                    id="image"
                    name="image"
                    type="text"
                    value={formData.image}
                    onChange={handleChange}

                />



                <button type="submit">Update Discovery</button>
            </form>
        </div>
    );
}

export default UpdateDiscovery;
