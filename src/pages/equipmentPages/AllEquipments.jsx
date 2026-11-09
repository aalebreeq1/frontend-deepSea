import { useState, useEffect } from 'react'
import { getAllEquipments } from "../../services/equipmentServices"
import { Link } from 'react-router'


function AllEquipments() {
    const [equipment, setEquipment] = useState([])

    useEffect(() => {
        async function loadEquipment() {
            const response = await getAllEquipments()
            console.log(response)
            setEquipment(response)
        }

        loadEquipment()
    }, [])

    return (
        <div>
            <h1>All Equipments</h1>
            {equipment.map((oneEquipment) => <div key={oneEquipment._id}>
                <h2>{oneEquipment.name}</h2>
                <Link to={`/equipments/${oneEquipment._id}`}>Equipment Details</Link>

            </div>)}
        </div>
    )
}

export default AllEquipments
