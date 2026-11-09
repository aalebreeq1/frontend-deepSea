import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { getEquipmentById, deleteEquipment } from "../../services/equipmentServices"

function EquipmentDetails() {
  const [equipment, setEquipment] = useState(null)

  const navigate = useNavigate()
  const { equipmentId } = useParams()

  async function loadEquipment() {
    const response = await getEquipmentById(equipmentId)
    setEquipment(response)
  }

  async function deleteOneEquipment() {
    await deleteEquipment(equipmentId)
    navigate('/equipments')
  }

  useEffect(() => {
    loadEquipment()
  }, [])

  return (
    <div>
      <h1>Equipment Details</h1>

      {equipment ? (
        <>
          <h2>{equipment.name}</h2>
          <p><b>Category:</b> {equipment.category}</p>
          <p><b>Description:</b> {equipment.description}</p>
          <p><b>Condition:</b> {equipment.condition}</p>
          <p><b>Image:</b> {equipment.image}</p>

          <button onClick={() => navigate(`/equipments/${equipment._id}/edit`)}>
            Edit Equipment
          </button>

          <button onClick={deleteOneEquipment}>
            Delete Equipment
          </button>
        </>
      ) : null}
    </div>
  )
}

export default EquipmentDetails