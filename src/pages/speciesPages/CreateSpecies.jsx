import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createSpecies} from '../../services/speciesService';
import './CreateSpecies.css'

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
        <div className='create-species-page'>
            <div className='create-species-container'>
            <h1 className='create-species-title'>Create Species</h1>
            <p className='create-species-subtitle'>Discover the Unknown</p>

            <form  className='create-species-form'onSubmit={handleSubmit}>
                <div className='species-form-group'>
                <label htmlFor="scientificName">Scientific Name</label>
                <input
                    id="scientificName"
                    name="scientificName"
                    type="text"
                    value={formData.scientificName}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className='species-form-group'>

                <label htmlFor="commonName">Common Name</label>
                <input
                    id="commonName"
                    name="commonName"
                    type="text"
                    value={formData.commonName}
                    onChange={handleChange}
                    
                />
                </div>

                <div className='species-form-group'>
                <label htmlFor="classification">Classification</label>
                <input
                    id="classification"
                    name="classification"
                    type="text"
                    value={formData.classification}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className='species-form-group'>

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    type="text"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder='Describe this species . . .'
                    rows={4}
                    required
                />
                </div>

                <div className='species-form-group'>

                <label htmlFor="image">Image URL</label>
                <input
                    id="image"
                    name="image"
                    type="text"
                    value={formData.image}
                    onChange={handleChange}
                    
                />
                </div>


                <button className='create-species-btn' type="submit">Create Species</button>
            </form>
        </div>
        </div>
       
    );
}

export default CreateSpecies;
