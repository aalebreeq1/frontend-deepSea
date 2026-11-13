import { useState, useEffect } from 'react'
import { getAllLocations } from "../../services/locationServices"
import { Link } from 'react-router'
import './AllLocations.css'

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
    <section className="locations-page">
        <h1 className="loc-hero-title">All Locations</h1>

        {locations.map((oneLocation) => (
            <div className="loc-card" key={oneLocation._id}>
                <h2 className="loc-name">{oneLocation.name}</h2>
                <Link className="loc-btn" to={`/locations/${oneLocation._id}`}>
                    Location Details
                </Link>
            </div>
        ))}

    </section>
  )
}

export default AllLocations