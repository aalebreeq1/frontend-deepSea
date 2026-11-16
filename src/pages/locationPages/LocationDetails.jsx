
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    getLocationById,
    deleteLocationById
} from '../../services/locationServices';
import './LocationDetails.css';

function LocationDetails({ user }) {
    const navigate = useNavigate();
    const { locationId } = useParams();

    const [location, setLocation] = useState(null);

    const isAdmin = user?.role === "admin";
    const canEdit = isAdmin || user?.role === "researcher";

    async function fetchLocation() {
        const data = await getLocationById(locationId);
        setLocation(data);
    }

    async function handleDelete() {
        await deleteLocationById(locationId);
        setLocation(null);
        navigate("/locations");
    }

    useEffect(() => {
        fetchLocation();
    }, [locationId]);

    return (
        <div className="location-details-page">

            {!location ? (
                <p className="location-loading">Loading location . . .</p>
            ) : (
                <div className="location-details-container">

                    <div className="location-details-header">
                        <div>
                            <p className="location-subtitle">EXPLORE THE UNKNOWN</p>
                            <h1>Location Details</h1>
                        </div>
                    </div>

                    <div className="location-details-wrapper">

                        <button
                            className="back-location-btn"
                            onClick={() => navigate('/locations')}
                        >
                            ← Back to Locations
                        </button>

                        <div className="location-details-heading">
                            <h1>Location <span>Details</span></h1>
                            <p>Explore the full information about this location</p>
                        </div>

                        <div className="location-details-content">

                            <div className="location-image-card">
                                <div className="no-location-image">
                                    Location Coordinates
                                </div>
                            </div>

                            <div className="location-info-section">

                                <div className="location-info-card">

                                    <h2>{location.name}</h2>

                                    <span className="location-type">
                                        {location.ocean}
                                    </span>

                                    <p className="location-description">
                                        Explore this underwater location and its geographical details.
                                    </p>

                                    <div className="location-meta">

                                        <div className="location-meta-item">
                                            <span>OCEAN</span>
                                            <p>{location.ocean}</p>
                                        </div>

                                        <div className="location-meta-item">
                                            <span>LATITUDE</span>
                                            <p>{location.latitude}</p>
                                        </div>

                                        <div className="location-meta-item">
                                            <span>LONGITUDE</span>
                                            <p>{location.longitude}</p>
                                        </div>

                                        <div className="location-meta-item">
                                            <span>DEPTH</span>
                                            <p>{location.depth} m</p>
                                        </div>

                                    </div>
                                </div>

                                <div className="location-actions">

                                    {canEdit && (
                                        <button
                                            className="edit-location-btn"
                                            onClick={() => navigate(`/locations/${location._id}/edit`)}
                                        >
                                            Edit Location
                                        </button>
                                    )}

                                    {isAdmin && (
                                        <button
                                            className="delete-location-btn"
                                            onClick={handleDelete}
                                        >
                                            Delete Location
                                        </button>
                                    )}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LocationDetails;
