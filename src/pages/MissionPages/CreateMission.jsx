import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createMission } from '../../services/MissionService';
import { getAllSubmarines } from '../../services/submarineService';
import { getAllLocations } from '../../services/locationServices';

function CreateMission() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        objective: '',
        startDate: '',
        endDate: '',
        submarine: '',
        location: '',
    });

    const [submarines, setSubmarines] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const submarineData = await getAllSubmarines();
                const locationData = await getAllLocations();

                setSubmarines(submarineData.submarines);
                setLocations(locationData);
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
            const missionData = { ...formData };

            if (!missionData.endDate) {
                delete missionData.endDate;
            }

            const mission = await createMission(missionData);
            navigate(`/mission/${mission._id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Create Mission</h1>

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

                <label htmlFor="objective">Objective</label>
                <input
                    id="objective"
                    name="objective"
                    type="text"
                    value={formData.objective}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="startDate">Start Date</label>
                <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="endDate">End Date</label>
                <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || undefined}
                />

                <label htmlFor="submarine">Submarine</label>
                <select
                    id="submarine"
                    name="submarine"
                    value={formData.submarine}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a submarine</option>
                    {submarines.map((submarine) => (
                        <option key={submarine._id} value={submarine._id}>
                            {submarine.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="location">Location</label>
                <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a location</option>
                    {locations.map((location) => (
                        <option key={location._id} value={location._id}>
                            {location.name}
                        </option>
                    ))}
                </select>

                <button type="submit">Create Mission</button>
            </form>
        </div>
    );
}

export default CreateMission;
