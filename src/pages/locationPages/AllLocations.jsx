import { useState, useEffect } from 'react'
import { getAllLocations } from "../../services/locationServices"
import { Link } from 'react-router'

function AllLocations() {
    const [locations, setLocations] = useState([])

    useEffect(() => {
            async function loadLocations() {
                const response = await getAllLocations()
                setLocations(response)
            }
    
            loadLocations()
        }, [])

  return (
    <div>
        <h1>All Locations</h1>
        {locations.map((oneLocation)=> <div key={oneLocation._id}>
            <h2>{oneLocation.name}</h2>
            <Link to={`/locations/${oneLocation._id}`}>Location Details</Link>

        </div> )}

    </div>
  )
}

export default AllLocations