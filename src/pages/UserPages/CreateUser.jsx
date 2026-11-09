import { useState } from "react"
import { createNewUser } from "../../services/userServices"
import { useNavigate } from "react-router"

function CreateUser() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "",
        specialization: "",
        institution: ""
    })

    const navigate = useNavigate()

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        await createNewUser(formData)

        navigate("/users")
    }

    return (
        <div>
            <h1>Create User</h1>

            <form onSubmit={handleSubmit}>

                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="role">Role:</label>
                <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="researcher">Researcher</option>
                    <option value="visitor">Visitor</option>
                </select>

                <label htmlFor="specialization">Specialization:</label>
                <input
                    type="text"
                    name="specialization"
                    id="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                />

                <label htmlFor="institution">Institution:</label>
                <input
                    type="text"
                    name="institution"
                    id="institution"
                    value={formData.institution}
                    onChange={handleChange}
                />

                <button type="submit">Add New</button>

            </form>
        </div>
    )
}

export default CreateUser