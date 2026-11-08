import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { getMissionById, updateMission } from '../../services/MissionService';
import { getAllSubmarines } from '../../services/submarineService';
import { getAllLocations } from '../../services/locationService';

function UpdateMission({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const canEdit = user?.role === 'admin' || user?.role === 'researcher';

    const [formData, setFormData] = useState(null);
    const [submarines, setSubmarines] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        if (!canEdit) return;

        const fetchData = async () => {
            try {
                const mission = await getMissionById(id);
                const submarineData = await getAllSubmarines();
                const locationData = await getAllLocations();

                setSubmarines(submarineData.submarines);
                setLocations(locationData);
                setFormData({
                    title: mission.title,
                    objective: mission.objective,
                    startDate: mission.startDate ? new Date(mission.startDate).toISOString().split('T')[0] : '',
                    endDate: mission.endDate ? new Date(mission.endDate).toISOString().split('T')[0] : '',
                    submarine: mission.submarine,
                    location: mission.location,
                    missionResearchers: mission.missionResearchers.map(
                        (researcher) => researcher._id
                    ),
                    equipment: mission.equipment.map((item) => item._id),
                });
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [id, canEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canEdit) return;

        try {
            await updateMission(id, {
                ...formData,
                endDate: formData.endDate || null,
            });
            navigate(`/mission/${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    if (!canEdit) {
        return <p>Only admins and researchers can update missions.</p>;
    }

    if (!formData) return null;

    return (
        <div>
            <h1>Update Mission</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="objective">Objective</label>
                <input
                    id="objective"
                    name="objective"
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

                <button type="submit">Save Changes</button>
                <Link to={`/mission/${id}`}>Cancel</Link>
            </form>
        </div>
    );
}

export default UpdateMission;
