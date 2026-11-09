import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import {
    getUserById,
    updateUserById
} from "../../services/userServices"

function UpdateUser() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "",
        specialization: "",
        institution: ""
    })

    const { userId } = useParams()
    const navigate = useNavigate()

    async function loadUser() {
        const response = await getUserById(userId)

        setFormData({
            username: response.username,
            email: response.email,
            role: response.role,
            specialization: response.specialization || "",
            institution: response.institution || ""
        })
    }

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        await updateUserById(userId, formData)

        navigate(`/users/${userId}`)
    }

    useEffect(() => {
        loadUser()
    }, [userId])

    return (
        <div>
            <h1>Update User</h1>

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

                <label htmlFor="role">Role:</label>
                <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
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

                <button type="submit">Update User</button>

            </form>
        </div>
    )
}

export default UpdateUser