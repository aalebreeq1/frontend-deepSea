import {useEffect ,useState } from 'react';
import { useNavigate ,useParams} from 'react-router';
import { getSpeciesById,updateSpecies} from '../../services/speciesService';
import './UpdateSpecies.css'

function UpdateSpecies() {
    const navigate = useNavigate();
    const {id} = useParams();

    const [formData, setFormData] = useState({
        scientificName: '',
        commonName: '',
        classification: '',
        description: '',
        image: '',
    });

    useEffect(()=>{
        const fetchSpecies= async()=>{
        try{
            const data = await getSpeciesById(id);
             setFormData({
                 scientificName: data.scientificName ||'',
                 commonName: data.commonName ||'',
                 classification: data.classification || '',
                 description:data.description || '',
                 image:data.image || '',
             })
            }catch(err){
                console.error(err);
        }
    };
    fetchSpecies();
    },[id]);

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


            await updateSpecies(id,speciesData);
            navigate(`/species/${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='update-species-page'>
            <div className='update-species-header'>
                <span className='update-species-label'>BENEATH THE SURFACE</span>
                 <h1>Update Species</h1>
                 <p>Modify the details of this marine species</p>
            </div>
            

            <form onSubmit={handleSubmit} className='update-species-form'>
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
                <textarea
                    id="description"
                    name="description"
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


                <button type="submit" className='update-species-button'>Update Species</button>
            </form>
        </div>
    );
}

export default UpdateSpecies;
