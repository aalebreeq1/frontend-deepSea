import { Link } from 'react-router';
import { ArrowRightUp } from 'reicon-react'
function FeaturedMissions() {
    return (
        <section className="homw-featured" aria-labelledby="featured-missions-title">
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
        </section>
    )
}

export default FeaturedMissions