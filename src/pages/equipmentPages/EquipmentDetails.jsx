
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getEquipmentById, deleteEquipment } from "../../services/equipmentServices";
import RecordFormModal from "../../components/RecordFormModal";
import "./EquipmentDetails.css";

function EquipmentDetails({ user }) {
    const [equipment, setEquipment] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const navigate = useNavigate();
    const { equipmentId } = useParams();

    const isAdmin = user?.role === "admin";
    const canEdit = isAdmin || user?.role === "researcher";

    async function loadEquipment() {
        const response = await getEquipmentById(equipmentId);
        setEquipment(response);
    }

    async function handleDelete() {
        await deleteEquipment(equipmentId);
        setEquipment(null);
        navigate("/equipments");
    }

    function handleSaved(updatedEquipment) {
        setEquipment(updatedEquipment.equipment || updatedEquipment);
        setShowEditModal(false);
    }

    useEffect(() => {
        loadEquipment();
    }, [equipmentId]);

    return (
        <div className="equipment-details-page">
            {!equipment ? (
                <p className="equipment-loading">Loading equipment . . .</p>
            ) : (
                <div className="equipment-details-container">

                    <div className="equipment-details-header">
                        <div>
                            <p className="equipment-subtitle">EXPLORE THE UNKNOWN</p>
                        </div>
                    </div>

                    <div className="equipment-details-wrapper">

                        <button
                            className="back-equipment-btn"
                            onClick={() => navigate("/equipments")}
                        >
                            ← Back to Equipment
                        </button>

                        <div className="equipment-details-heading">
                            <h1>Equipment <span>Details</span></h1>
                            <p>Explore the full information about this equipment</p>
                        </div>

                        <div className="equipment-details-content">

                            <div className="equipment-image-card">
                                {equipment.image ? (
                                    <img
                                        src={equipment.image}
                                        alt={equipment.name}
                                    />
                                ) : (
                                    <div className="no-equipment-image">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            <div className="equipment-info-section">

                                <div className="equipment-info-card">

                                    <h2>{equipment.name}</h2>

                                    <span className="equipment-type">
                                        {equipment.category}
                                    </span>

                                    <p className="equipment-description">
                                        {equipment.description || "No description available."}
                                    </p>

                                    <div className="equipment-meta">

                                        <div className="equipment-meta-item">
                                            <span>CATEGORY</span>
                                            <p>{equipment.category}</p>
                                        </div>

                                        <div className="equipment-meta-item">
                                            <span>CONDITION</span>
                                            <p>{equipment.condition}</p>
                                        </div>

                                    </div>
                                </div>

                                <div className="equipment-actions">

                                    {canEdit && (
                                        <button
                                            className="edit-equipment-btn"
                                            onClick={() => setShowEditModal(true)}
                                        >
                                            Edit Equipment
                                        </button>
                                    )}

                                    {isAdmin && (
                                        <button
                                            className="delete-equipment-btn"
                                            onClick={handleDelete}
                                        >
                                            Delete Equipment
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>

                        {showEditModal && equipment && (
                            <RecordFormModal
                                kind="equipment"
                                user={user}
                                record={equipment}
                                onClose={() => setShowEditModal(false)}
                                onSaved={handleSaved}
                            />
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}

export default EquipmentDetails;
