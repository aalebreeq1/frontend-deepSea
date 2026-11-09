import { useState, useEffect } from "react"
import { getAllUsers } from "../../services/userServices"
import { Link } from "react-router"

function AllUsers() {
    const [users, setUsers] = useState([])

    async function loadUsers() {
        const response = await getAllUsers()
        setUsers(response)
    }

    useEffect(() => {
        loadUsers()
    }, [])

    return (
        <div>
            <h1>All Users</h1>

            {users.map((oneUser) => (
                <div key={oneUser._id}>
                    <h2>{oneUser.username}</h2>
                    <p>Email: {oneUser.email}</p>
                    <p>Role: {oneUser.role}</p>

                    <Link to={`/users/${oneUser._id}`}>
                        View Details
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default AllUsers