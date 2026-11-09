import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { getLocationById, deleteLocationById} from "../../services/locationServices"

function LocationDetails() {
  const [location, setLocation] = useState(null)

  const navigate = useNavigate()
  const { locationId } = useParams()

  async function loadLocation() {
    const response = await getLocationById(locationId)
    setLocation(response)
  }

  async function deleteOneLocation() {
    await deleteLocationById(locationId)
    navigate('/locations')
  }

  useEffect(() => {
    loadLocation()
  }, [])

  return (
    <div>
      <h1>Location Details</h1>

      {location ? (
        <>
          <h2>{location.name}</h2>
          <p><b>Ocean:</b> {location.ocean}</p>
          <p><b>Latitude:</b> {location.latitude}</p>
          <p><b>Longitude:</b> {location.longitude}</p>
          <p><b>Depth:</b> {location.depth}</p>

          <button onClick={() => navigate(`/locations/${location._id}/edit`)}>
            Edit Location
          </button>

          <button onClick={deleteOneLocation}>
            Delete Location
          </button>
        </>
      ) : null}
    </div>
  )
}

export default LocationDetails