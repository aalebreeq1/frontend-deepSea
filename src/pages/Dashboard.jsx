
function Dashboard({ user }) {
  return (
    <div>
        <h1>Welcome {user.username}</h1>
        <button onClick={() => navigate("/users/new")}>
    Create User
</button> // make this feat active only for admin
    </div>
  )
}

export default Dashboard