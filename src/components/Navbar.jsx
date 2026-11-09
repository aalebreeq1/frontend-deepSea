import { Link } from 'react-router'

function Navbar({ user, handleLogout }) {
  return (
    <nav>
      <Link to='/'>Homepage</Link>
      <Link to='/all-missions'>Missions</Link>
      <Link to='/all-submarines'>Submarines</Link>
      <Link to='/equipments'>Equipments</Link>
      <Link to='/locations'>Locations</Link>

      {user && user.role !== 'visitor'
        ?
        (<>
          {user.role === 'admin' && (
            <Link to='/dashboard'>Dashboard</Link>
          )}
          <Link to='/create-mission'>Create Mission</Link>
          <Link to='/create-submarines'>Create Submarine</Link>
          <Link to='/locations/new'>Create Location</Link>
          <button onClick={handleLogout}>Sign Out</button>
        </>) :
        (<>
          <Link to='/sign-up'>Sign Up</Link>
          <Link to='/sign-in'>Sign In</Link>
        </>)}
    </nav>
  )
}

export default Navbar