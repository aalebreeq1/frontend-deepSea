import { useEffect, useId, useRef, useState } from "react";
import { Form, Modal, toast } from "@heroui/react";
import { createMission, updateMission } from "../services/MissionService";
import { createSubmarine, getAllSubmarines, updateSubmarine } from "../services/submarineService";
import { getAllLocations } from "../services/locationServices";
import { uploadImage } from "../services/uploadService";
import "./RecordFormModal.css";

function RecordFormModal({ kind, user, record = null, onClose, onSaved }) {
  const formId = useId();
  const imageInput = useRef(null);
  const isMission = kind === "mission";
  const isEditing = Boolean(record?._id);
  const isCreatingSubmarine = !isMission && !isEditing;
  const title = isMission ? "Mission" : "Submarine";
  const isAdmin = user?.role === "admin";
  const canSubmit = isEditing
    ? isAdmin || user?.role === "researcher"
    : isAdmin || user?.role === "visitor";

  const [formData, setFormData] = useState({
    title: record?.title || "",
    objective: record?.objective || "",
    startDate: record?.startDate?.slice(0, 10) || "",
    endDate: record?.endDate?.slice(0, 10) || "",
    submarine: record?.submarine?._id || record?.submarine || "",
    location: record?.location?._id || record?.location || "",
    name: record?.name || "",
    model: record?.model || "",
    maxDepth: record?.maxDepth ?? "",
    capacity: record?.capacity ?? "",
    description: record?.description || "",
    image: record?.image || "",
  });
  const [submarines, setSubmarines] = useState([]);
  const [locations, setLocations] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(record?.image || "");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (!isMission || !canSubmit) return;
    let active = true;

    async function loadOptions() {
      try {
        const [submarineData, locationData] = await Promise.all([
          getAllSubmarines(),
          getAllLocations(),
        ]);
        if (active) {
          setSubmarines(submarineData.submarines);
          setLocations(locationData);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadOptions();
    return () => { active = false; };
  }, [isMission, canSubmit]);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Your image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setImageError("");
  }

  function cancelImageSelection() {
    setImageFile(null);
    setPreview(formData.image);
    setImageError("");
    if (imageInput.current) imageInput.current.value = "";
  }

  function hideBrokenImage(event) {
    event.currentTarget.style.display = "none";
  }

  function handleOpenChange(open) {
    if (!open && !saving) onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit || saving || imageError) return;

    setSaving(true);

    try {
      let saved;

      if (isMission) {
        const missionData = {
          title: formData.title.trim(),
          objective: formData.objective.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate || null,
          submarine: formData.submarine,
          location: formData.location,
        };

        if (!missionData.title || !missionData.objective) {
          console.error("Enter a title and objective for your mission.");
          return;
        }

        if (isEditing) {
          missionData.missionResearchers = (record.missionResearchers || []).map(
            (researcher) => researcher._id || researcher
          );
          missionData.equipment = (record.equipment || []).map(
            (item) => item._id || item
          );
          saved = await updateMission(record._id, missionData);
        } else {
          saved = await createMission(missionData);
        }

        saved.submarine = submarines.find((item) => item._id === formData.submarine) || saved.submarine;
        saved.location = locations.find((item) => item._id === formData.location) || saved.location;

        if (isEditing) {
          saved.missionResearchers = record.missionResearchers;
          saved.equipment = record.equipment;
        }
      } else {
        const submarineData = {
          name: formData.name.trim(),
          model: formData.model.trim(),
          maxDepth: Number(formData.maxDepth),
          capacity: Number(formData.capacity),
          description: formData.description.trim(),
          image: formData.image,
        };

        if (!submarineData.name || !submarineData.model) {
          console.error("Enter a name and model for your submarine.");
          if (isCreatingSubmarine) toast.danger("Enter a name and model for your submarine.");
          return;
        }

        if (imageFile) {
          setUploading(true);
          const uploaded = await uploadImage(imageFile);
          submarineData.image = uploaded.image;
          setFormData({ ...formData, image: uploaded.image });
          setPreview(uploaded.image);
          setImageFile(null);
          if (imageInput.current) imageInput.current.value = "";
          setUploading(false);
        }

        let result;
        if (isEditing) {
          result = await updateSubmarine(record._id, submarineData);
        } else {
          result = await createSubmarine(submarineData);
        }
        saved = result.submarine;
      }

      onSaved(saved);
      if (isCreatingSubmarine) toast.success("Submarine created successfully");
      onClose();
    } catch (err) {
      console.error(err);
      const message = err.response?.status === 401
        ? "Your session has expired. Please sign in again."
        : err.response?.data?.message || err.response?.data?.error || "Could not save changes. Please try again.";

      if (isCreatingSubmarine) {
        toast.danger(message);
      } else {
        window.alert(message);
      }
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  if (!canSubmit) return null;

  return (
    <Modal.Backdrop
      isOpen
      className="record-backdrop"
      isDismissable={!saving}
      isKeyboardDismissDisabled={saving}
      onOpenChange={handleOpenChange}
    >
      <Modal.Container size="lg" scroll="inside">
        <Modal.Dialog className="record-modal">
          <Modal.CloseTrigger className="record-close" isDisabled={saving}>
            Close
          </Modal.CloseTrigger>

          <Modal.Header className="record-header">
            <p className="record-eyebrow">{isMission ? "EXPEDITION PLANNING" : "THE DEEPSEA FLEET"}</p>
            <Modal.Heading className="record-heading">
              {isEditing ? "Edit " : "Create "}{title.toLowerCase()}.
            </Modal.Heading>
            <p className="record-intro">
              {isMission
                ? "Give your next expedition a purpose, a place, and a plan."
                : "Prepare your vessel for its next journey below the surface."}
            </p>
          </Modal.Header>

          <Form id={formId} onSubmit={handleSubmit} className="record-dialog-form" validationBehavior="native">
            <Modal.Body className="record-body">
              <div className="record-form">
              {isMission ? (
                <>
                  <div className="record-field record-wide">
                    <label htmlFor={formId + "-title"}>Mission title</label>
                    <input
                      id={formId + "-title"}
                      name="title"
                      placeholder="Name your expedition"
                      value={formData.title}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="record-field record-wide">
                    <label htmlFor={formId + "-objective"}>Objective</label>
                    <textarea
                      id={formId + "-objective"}
                      name="objective"
                      rows={3}
                      placeholder="What do you hope to discover?"
                      value={formData.objective}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="record-field">
                    <label htmlFor={formId + "-start"}>Start date</label>
                    <input
                      id={formId + "-start"}
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="record-field">
                    <label htmlFor={formId + "-end"}>End date <span>(optional)</span></label>
                    <input
                      id={formId + "-end"}
                      name="endDate"
                      type="date"
                      min={formData.startDate || undefined}
                      value={formData.endDate}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </div>

                  <div className="record-field">
                    <label htmlFor={formId + "-submarine"}>Submarine</label>
                    <select
                      id={formId + "-submarine"}
                      name="submarine"
                      value={formData.submarine}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    >
                      <option value="">Choose a submarine</option>
                      {submarines.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
                    </select>
                    {submarines.length === 0 && <p className="record-help">Add a submarine before creating a mission.</p>}
                  </div>

                  <div className="record-field">
                    <label htmlFor={formId + "-location"}>Location</label>
                    <select
                      id={formId + "-location"}
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    >
                      <option value="">Choose a location</option>
                      {locations.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
                    </select>
                    {locations.length === 0 && <p className="record-help">Add a location before creating a mission.</p>}
                  </div>
                </>
              ) : (
                <>
                  <div className="record-field">
                    <label htmlFor={formId + "-name"}>Submarine name</label>
                    <input
                      id={formId + "-name"}
                      name="name"
                      placeholder="Name your vessel"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="record-field">
                    <label htmlFor={formId + "-model"}>Model</label>
                    <input
                      id={formId + "-model"}
                      name="model"
                      placeholder="Enter the model"
                      value={formData.model}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="record-field">
                    <label htmlFor={formId + "-depth"}>Maximum depth <span>(meters)</span></label>
                    <input
                      id={formId + "-depth"}
                      name="maxDepth"
                      type="number"
                      min="0.01"
                      step="any"
                      placeholder="300"
                      value={formData.maxDepth}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="record-field">
                    <label htmlFor={formId + "-capacity"}>Crew capacity</label>
                    <input
                      id={formId + "-capacity"}
                      name="capacity"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="6"
                      value={formData.capacity}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="record-field record-wide">
                    <label htmlFor={formId + "-description"}>Description <span>(optional)</span></label>
                    <textarea
                      id={formId + "-description"}
                      name="description"
                      rows={3}
                      placeholder="Tell us about this submarine and its capabilities."
                      value={formData.description}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </div>

                  <div className="record-field record-wide">
                    <p className="record-upload-label">Vessel image <span>(optional)</span></p>
                    <div className="record-upload">
                      <div className="record-image-preview">
                        <span>{preview ? "Image preview unavailable" : "Your vessel, in focus."}</span>
                        {preview && <img key={preview} src={preview} alt="Submarine preview" onError={hideBrokenImage} />}
                      </div>
                      <div className="record-upload-copy">
                        <strong>{imageFile ? imageFile.name : formData.image ? "Current vessel image" : "Add a photo of your vessel"}</strong>
                        <p id={formId + "-image-help"}>JPEG, PNG, or WebP. Up to 5 MB.</p>
                        <label className="record-file-button">
                          <input
                            ref={imageInput}
                            type="file"
                            aria-label="Choose a submarine image"
                            aria-describedby={formId + "-image-help"}
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            disabled={saving}
                          />
                          {preview ? "Change image" : "Choose image"}
                        </label>
                        {(imageFile || imageError) && <button className="record-image-cancel" type="button" onClick={cancelImageSelection} disabled={saving}>Cancel selection</button>}
                      </div>
                    </div>
                    {imageError && <p className="record-error" role="alert">{imageError}</p>}
                  </div>
                </>
              )}

              {uploading && <p className="record-notice record-wide" role="status">Uploading your image...</p>}
              </div>
            </Modal.Body>

            <Modal.Footer className="record-footer">
              <span className="record-footer-note">DEEPSEA / BEYOND THE SURFACE</span>
              <div className="record-footer-buttons">
                <button type="button" className="record-button record-button-cancel" onClick={onClose} disabled={saving}>Cancel</button>
                <button type="submit" className="record-button record-button-save" disabled={saving || Boolean(imageError)} aria-busy={saving}>
                  {uploading ? "Uploading image..." : saving ? "Saving..." : isEditing ? "Save changes" : "Create " + title.toLowerCase()}
                </button>
              </div>
            </Modal.Footer>
          </Form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

export default RecordFormModal;
