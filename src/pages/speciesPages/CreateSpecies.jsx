import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createSpecies} from '../../services/speciesService';


function CreateSpecies() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        scientificName: '',
        commonName: '',
        classification: '',
        description: '',
        image: '',
    });

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
            const speciesData = { ...formData };

            if (!speciesData.commonName) {
                delete speciesData.commonName;
            }

            if(!speciesData.image){
                delete speciesData.image
            }

            const species = await createSpecies(speciesData);
            navigate(`/species/${species._id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Create Species</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="scientificName">Scientific Name</label>
                <input
                    id="scientificName"
                    name="scientificName"
                    type="text"
                    value={formData.scientificName}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="commonName">Common Name</label>
                <input
                    id="commonName"
                    name="commonName"
                    type="text"
                    value={formData.commonName}
                    onChange={handleChange}
                    
                />

                <label htmlFor="classification">Classification</label>
                <input
                    id="classification"
                    name="classification"
                    type="text"
                    value={formData.classification}
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

                <label htmlFor="image">Image URL</label>
                <input
                    id="image"
                    name="image"
                    type="text"
                    value={formData.image}
                    onChange={handleChange}
                    
                />


                <button type="submit">Create Species</button>
            </form>
        </div>
    );
}

export default CreateSpecies;
