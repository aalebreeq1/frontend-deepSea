import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { createSubmarine } from "../../services/submarineService";
function CreateSubmarines({user}) {
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    maxDepth: "",
    capacity: "",
    description: "",
    image: "",
  });
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    await createSubmarine(formData);
    navigate("/all-submarines");
  }
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div>
      CreateSubmarines
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <label>Model</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
        />
        <label>Max Depth</label>
        <input
          type="text"
          name="maxDepth"
          value={formData.maxDepth}
          onChange={handleChange}
        />
        <label>Capacity</label>
        <input
          type="text"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
        />
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <label>Image</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateSubmarines;
