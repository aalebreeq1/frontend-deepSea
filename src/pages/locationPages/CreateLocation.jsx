import { useState } from 'react'
import { createNewLocation } from "../../services/locationServices"
import { useNavigate } from 'react-router'

function CreateLocation() {
    const [formData, setFormData] = useState({
        name: "",
        ocean: "",
        latitude: "",
        longitude: "",
        depth: ""
    });

    const navigate = useNavigate()

    function handleChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        await createNewLocation({
            ...formData,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            depth: Number(formData.depth)
        });
        navigate('/locations')

    }
    return (
        <div>
            <h1>Create Location</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name: </label>
                <input
                    name="name"
                    type="text"
                    id="name"
                    onChange={handleChange}
                    value={formData.name}
                    required
                />

                <label htmlFor="ocean">Ocean: </label>
                <input
                    name="ocean"
                    type="text"
                    id="ocean"
                    onChange={handleChange}
                    value={formData.ocean}
                    required
                />

                <label htmlFor="latitude">Latitude: </label>
                <input
                    name="latitude"
                    type="number"
                    id="latitude"
                    onChange={handleChange}
                    value={formData.latitude}
                    required
                />

                <label htmlFor="longitude">Longitude: </label>
                <input
                    name="longitude"
                    type="number"
                    id="longitude"
                    onChange={handleChange}
                    value={formData.longitude}
                    required
                />

                <label htmlFor="depth">Depth (meters): </label>
                <input
                    name="depth"
                    type="number"
                    id="depth"
                    onChange={handleChange}
                    value={formData.depth}
                />
                <button type="submit">Add New</button>
            </form>

        </div>
    )
}

export default CreateLocation