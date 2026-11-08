import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  updateSubmarine,
  getSubmarineById,
} from "../../services/submarineService";

function UpdateSubmarines({user}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    maxDepth: "",
    capacity: "",
    status: "",
    description: "",
    image: "",
  });

  async function fetchSubmarine() {
    const data = await getSubmarineById(id);
    setFormData({
      name: data.name,
      model: data.model,
      maxDepth: data.maxDepth,
      capacity: data.capacity,
      status: data.status,
      description: data.description,
      image: data.image,
    });
  }

  useEffect(() => {
    fetchSubmarine();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await updateSubmarine(id, {
      ...formData,
    });
    navigate("/all-submarines");
  }

  return (
    <div>
      <h1>Update Submarine</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </label>

        <label>
          Model:
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model"
            required
          />
        </label>

        <label>
          Max Depth:
          <input
            type="number"
            name="maxDepth"
            value={formData.maxDepth}
            onChange={handleChange}
            placeholder="Max Depth"
            required
          />
        </label>

        <label>
          Capacity:
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />
        </label>

        <label>
          Image URL:
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/submarine.jpg"
          />
        </label>

        <button type="submit" onClick={handleSubmit}>Update Submarine</button>
      </form>
    </div>
  );
}

export default UpdateSubmarines;
