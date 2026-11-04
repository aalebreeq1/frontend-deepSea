import { useEffect } from "react"
import { getAllLocations } from "../services/locationService"

function TestLocations() {

    useEffect(() => {
        async function fetchLocations() {
            const locations = await getAllLocations()
            console.log(locations)
        }

        fetchLocations()
    }, [])

    return <h1>Testing Locations</h1>
}

export default TestLocations