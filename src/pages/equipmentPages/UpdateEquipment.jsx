import { useState, useEffect } from "react";
import { updateEquipment, getEquipmentById } from "../../services/equipmentServices";
import { useNavigate, useParams } from "react-router";

function UpdateEquipment() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    condition: "",
    image: ""
  });

  const navigate = useNavigate();
  const { equipmentId } = useParams();

  useEffect(() => {
    async function loadEquipment() {
      const response = await getEquipmentById(equipmentId);
      setFormData(response);
    }

    loadEquipment();
  }, [equipmentId]);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
        console.log("Update button clicked")


    await updateEquipment(equipmentId, formData);

    navigate("/equipments");
  }

  return (
    <div>
      <h1>Update Equipment</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input
          name="name"
          type="text"
          id="name"
          onChange={handleChange}
          value={formData.name}
        />

        <label htmlFor="category">Category: </label>
        <select
          value={formData.category}
          onChange={handleChange}
          name="category"
          id="category"
        >
          <option value="">-------</option>
          <option value="Imaging">Imaging</option>
          <option value="Navigation">Navigation</option>
          <option value="Sampling">Sampling</option>
          <option value="Communication">Communication</option>
          <option value="Robotics">Robotics</option>
          <option value="Scientific Sensors">Scientific Sensors</option>
        </select>

        <label htmlFor="description">Description: </label>
        <input
          name="description"
          type="text"
          id="description"
          onChange={handleChange}
          value={formData.description}
        />

        <label htmlFor="condition">Condition:</label>
        <select
          name="condition"
          id="condition"
          value={formData.condition}
          onChange={handleChange}
        >
          <option value="">-------</option>
          <option value="operational">Operational</option>
          <option value="needs_maintenance">Needs Maintenance</option>
          <option value="out_of_service">Out of Service</option>
        </select>

        <label htmlFor="image">Image URL:</label>
        <input
          name="image"
          type="text"
          id="image"
          onChange={handleChange}
          value={formData.image}
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateEquipment;