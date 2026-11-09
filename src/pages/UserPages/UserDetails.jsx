import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import {
    getUserById,
    deleteUserById
} from "../../services/userServices"

function UserDetails() {
    const [user, setUser] = useState(null)

    const navigate = useNavigate()
    const { userId } = useParams()

    async function loadUser() {
        const response = await getUserById(userId)
        setUser(response)
    }

    async function deleteOneUser() {
        await deleteUserById(userId)
        navigate("/users")
    }

    useEffect(() => {
        loadUser()
    }, [userId])

    return (
        <div>
            <h1>User Details</h1>

            {user ? (
                <>
                    <h2>{user.username}</h2>

                    <p>
                        <b>Email:</b> {user.email}
                    </p>

                    <p>
                        <b>Role:</b> {user.role}
                    </p>

                    <p>
                        <b>Specialization:</b> {user.specialization}
                    </p>

                    <p>
                        <b>Institution:</b> {user.institution}
                    </p>

                    <button
                        onClick={() => navigate(`/users/${user._id}/edit`)}
                    >
                        Edit User
                    </button>

                    <button onClick={deleteOneUser}>
                        Delete User
                    </button>
                </>
            ) : null}
        </div>
    )
}

export default UserDetails