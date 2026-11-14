import { Link, useParams, useNavigate } from "react-router";
import {
  getSubmarineById,
  deleteSubmarine,
  updateSubmarineState,
} from "../../services/submarineService";
import { useEffect, useState } from "react";
import RecordFormModal from "../../components/RecordFormModal";
import "./SubmarinesDetails.css";

function SubmarinesDetails({ user }) {
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [submarine, setSubmarine] = useState(null);
  const [pending, setPending] = useState(false);
  const isAdmin = user?.role === "admin";
  const canDelete = isAdmin || user?.role === "visitor";
  const canEdit = isAdmin || user?.role === "researcher";

  async function handleDelete() {
    if (!canDelete || pending) return;

    setPending(true);

    try {
      await deleteSubmarine(id);
      navigate("/all-submarines");
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  }

  async function handleUpdateState(newState) {
    if (!canEdit || pending) return;

    setPending(true);

    try {
      const data = await updateSubmarineState(id, newState);
      setSubmarine(data.submarine);
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  }
  useEffect(() => {
    let active = true;

    async function fetchSubmarine() {
      try {
        const data = await getSubmarineById(id);
        if (active) setSubmarine(data.submarine);
      } catch (err) {
        console.error(err);
      }
    }

    fetchSubmarine();

    return () => {
      active = false;
    };
  }, [id]);

  if (!submarine || submarine._id !== id) {
    return (
      <main className="submarine-details-page">
        <div className="submarine-details-shell">
          <Link className="submarine-detail-back" to="/all-submarines">
            <span aria-hidden="true">←</span> Back to submarines
          </Link>
          <p role="status">Loading submarine...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="submarine-details-page">
      <div className="submarine-details-shell">
        <Link className="submarine-detail-back" to="/all-submarines">
          <span aria-hidden="true">←</span> Back to submarines
        </Link>

        <header className="submarine-detail-heading">
          <div className="submarine-detail-heading-top">
            <p className="submarine-detail-label">DeepSea / Research fleet</p>
            <span className={`submarine-detail-status ${submarine.status}`}>
              {submarine.status?.replaceAll("_", " ")}
            </span>
          </div>
          <h1>{submarine.name}</h1>
          <p className="submarine-detail-model">{submarine.model}</p>
        </header>

        <div className="submarine-detail-overview">
          <figure className="submarine-detail-photo">
            <img
              src={submarine.image || "/images/submarine-still.jpg"}
              alt={submarine.image ? submarine.name : "Research submarine"}
            />
            <figcaption>DeepSea / Beneath the surface</figcaption>
          </figure>

          <section className="submarine-detail-panel" aria-labelledby="submarine-overview-title">
            <p className="submarine-detail-label">The vessel</p>
            <h2 id="submarine-overview-title">Vessel overview</h2>
            <p className="submarine-detail-description">
              {submarine.description || "No description has been added for this submarine."}
            </p>

            <dl className="submarine-detail-specs">
              <div>
                <dt>Maximum depth</dt>
                <dd>{submarine.maxDepth ?? "—"} <span>m</span></dd>
              </div>
              <div>
                <dt>Capacity</dt>
                <dd>{submarine.capacity ?? "—"} <span>people</span></dd>
              </div>
            </dl>

            <dl className="submarine-detail-facts">
              <div>
                <dt>Model</dt>
                <dd>{submarine.model}</dd>
              </div>
              <div>
                <dt>Current status</dt>
                <dd className="submarine-detail-status-text">
                  {submarine.status?.replaceAll("_", " ")}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {(canEdit || canDelete) && (
          <section
            className="submarine-detail-management"
            aria-labelledby="submarine-management-title"
            aria-busy={pending}
          >
            <div>
              <p className="submarine-detail-label">Fleet management</p>
              <h2 id="submarine-management-title">Manage submarine</h2>
              <p>Update the vessel details and operational status.</p>
            </div>

            <div className="submarine-detail-actions">
              {canEdit && (
                <button
                  type="button"
                  className="submarine-detail-button submarine-detail-primary"
                  disabled={pending}
                  onClick={() => setShowEdit(true)}
                >
                  Edit Submarine
                </button>
              )}

              {canEdit && submarine.status === "operational" && (
                <>
                  <button
                    type="button"
                    className="submarine-detail-button"
                    disabled={pending}
                    onClick={() => handleUpdateState("under_maintenance")}
                  >
                    Set Under Maintenance
                  </button>
                  <button
                    type="button"
                    className="submarine-detail-button"
                    disabled={pending}
                    onClick={() => handleUpdateState("retired")}
                  >
                    Set Retired
                  </button>
                </>
              )}

              {canEdit && submarine.status === "under_maintenance" && (
                <button
                  type="button"
                  className="submarine-detail-button"
                  disabled={pending}
                  onClick={() => handleUpdateState("operational")}
                >
                  Set Operational
                </button>
              )}

              {canDelete && (
                <button
                  type="button"
                  className="submarine-detail-button submarine-detail-delete"
                  disabled={pending}
                  onClick={handleDelete}
                >
                  Delete Submarine
                </button>
              )}
            </div>

            {pending && (
              <p className="submarine-detail-saving" role="status">Saving changes...</p>
            )}
          </section>
        )}

        <footer className="submarine-detail-footer">DeepSea / Beyond the surface</footer>
      </div>

      {canEdit && showEdit && (
        <RecordFormModal
          key={submarine._id}
          kind="submarine"
          user={user}
          record={submarine}
          onClose={() => setShowEdit(false)}
          onSaved={setSubmarine}
        />
      )}
    </main>
  );
}

export default SubmarinesDetails;
