import { useState } from "react";
import { Link } from "react-router";
import { ArrowRightUp } from "reicon-react";

function MissionCard({ mission }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article className="home-mission-card">
      <div
        className={
          flipped
            ? "home-card-inner is-flipped"
            : "home-card-inner"
        }
      >
        {/* Front */}
        <div
          className="home-card-face home-card-front"
          inert={flipped}
        >
          <span className="home-mission-status">
            {mission.status}
          </span>

          <h3>{mission.title}</h3>

          <p className="home-mission-location">
            {mission.location?.name || "Location pending"}
          </p>
        </div>

        {/* Back */}
        <div
          className="home-card-face home-card-back"
          inert={!flipped}
        >
          <h3>{mission.title}</h3>

          <p>{mission.objective}</p>

          <p>
            Submarine:{" "}
            {mission.submarine?.name || "Not assigned"}
          </p>

          <p>
            Researchers:{" "}
            {mission.missionResearchers?.length || 0}
          </p>

          <Link
            to={`/mission/${mission._id}`}
            className="home-view-all"
          >
            Open mission

            <span aria-hidden="true">
              <ArrowRightUp size={16} />
            </span>
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="home-card-flip"
        onClick={() => setFlipped(!flipped)}
        aria-expanded={flipped}
      >
        {flipped ? "Back to preview" : "View mission brief"}
      </button>
    </article>
  );
}

export default MissionCard;