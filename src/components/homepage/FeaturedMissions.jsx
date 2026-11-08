import { Link } from 'react-router';
import { ArrowRightUp } from 'reicon-react'
import { useState, useEffect } from 'react'
import { getAllMissions } from '../../services/MissionService'
import MissionCard from "./MissionCard";
function FeaturedMissions() {
    const [missions, setMissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let ignore = false
        async function loadMissions() {
            try {
                const data = await getAllMissions()
                if (!ignore) {
                    setMissions(data.slice(0, 3))
                    setLoading(false)
                }
            }
            catch (e) {
                const noMissions =
                    e.response?.status === 404 &&
                    e.response?.data?.message === "No missions found"
                if (!ignore) {
                    setError(noMissions ? "" : "Unable to load missions.");
                    setLoading(false)
                }
            }
        }
        loadMissions()
        return () => { ignore = true }
    }, [])
    return (
        <section className="home-featured" aria-labelledby="featured-missions-title">
            <div className="home-featured-heading">
                <div>
                    <p className="home-eyebrow">
                        01 / GO FURTHER
                    </p>
                    <h2 id="featured-missions-title">
                        Pick a mission.
                        <br />
                        <span>Make a discovery.</span>
                    </h2>
                </div>

                <Link to='/all-missions' className="home-view-all">
                    View all missions
                    <span aria-hidden="true"><ArrowRightUp size={16} /></span>
                </Link>
            </div>

            <p className="home-featured-description">
                From sunlit reefs to the quiet unknown.
                Find the expedition that sparks yout curiosity
            </p>

            {loading && (
                <p role="status">Loading missions...</p>
            )}
            {error && (
                <p role="alert">{error}</p>
            )}
            {!loading && !error && missions.length === 0 && (
                <p>No missions available.</p>
            )}

            <div className="home-mission-grid">
                {missions.map((mission) => (
                    <MissionCard
                        key={mission._id}
                        mission={mission}
                    />
                    
                ))}
            </div>

        </section>
    )
}

export default FeaturedMissions