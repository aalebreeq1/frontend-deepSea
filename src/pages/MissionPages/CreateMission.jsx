import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createMission } from '../../services/MissionService';
import { getAllSubmarines } from '../../services/submarineService';
import { getAllLocations } from '../../services/locationService';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let active = true;

        const fetchOptions = async () => {
            try {
                const [submarineData, locationData] = await Promise.all([
                    getAllSubmarines(),
                    getAllLocations(),
                ]);

                if (active) {
                    setSubmarines(submarineData.submarines);
                    setLocations(locationData);
                }
            } catch (err) {
                console.error(err);

                if (active) {
                    setError('Failed to load submarines and locations.');
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchOptions();

        return () => {
            active = false;
        };
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

        if (isSubmitting) return;

        setError('');
        setIsSubmitting(true);

        try {
            const missionData = { ...formData };

            if (!missionData.endDate) {
                delete missionData.endDate;
            }

            const mission = await createMission(missionData);
            navigate(`/mission/${mission._id}`);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.response?.data?.err ||
                'Failed to create mission.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Create Mission</h1>

            {error && <p role="alert">{error}</p>}

            {loading && <p>Loading submarines and locations...</p>}

            {!loading && !error && (
                <>
                    {submarines.length === 0 && (
                        <p>No submarines available.</p>
                    )}
                    {locations.length === 0 && (
                        <p>No locations available.</p>
                    )}
                </>
            )}

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
                    disabled={loading || isSubmitting}
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
                    disabled={loading || isSubmitting}
                    required
                >
                    <option value="">Select a location</option>
                    {locations.map((location) => (
                        <option key={location._id} value={location._id}>
                            {location.name}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    disabled={
                        loading ||
                        isSubmitting ||
                        submarines.length === 0 ||
                        locations.length === 0
                    }
                >
                    {isSubmitting ? 'Creating...' : 'Create Mission'}
                </button>
            </form>
        </div>
    );
}

export default CreateMission;