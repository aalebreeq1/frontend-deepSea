import { useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import "./Navbar.css";

function Navbar({ user, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const { pathname } = useLocation();

  function closeMenu() {
    setMenuOpen(false);
  }

  function signOut() {
    closeMenu();
    handleLogout();
  }

  function handleKeyDown(event) {
    if (event.key === "Escape" && menuOpen) {
      closeMenu();
      menuButton.current?.focus();
    }
  }

  return (
    <header
      className={"deepsea-navbar " + (pathname === "/" ? "navbar-home" : "")}
      onKeyDown={handleKeyDown}
    >
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        DEEPSEA<span>.</span>
      </Link>

      <button
        ref={menuButton}
        type="button"
        className="navbar-menu-button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "Close" : "Menu"}
      </button>

      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={"navbar-navigation " + (menuOpen ? "is-open" : "")}
      >
        <div className="navbar-links">
          <NavLink to="/" end onClick={closeMenu}>Discover</NavLink>
          <NavLink
            to="/all-missions"
            className={pathname.includes("mission") ? "active" : ""}
            onClick={closeMenu}
          >
            Missions
          </NavLink>
          <NavLink
            to="/all-submarines"
            className={pathname.includes("submarine") ? "active" : ""}
            onClick={closeMenu}
          >
            Submarines
          </NavLink>
          <NavLink to="/equipments" onClick={closeMenu}>Equipment</NavLink>
          <NavLink to="/locations" onClick={closeMenu}>Locations</NavLink>

         
          <NavLink
           to="all-discoveries" className={pathname.includes("discover")? "active":""}
           onClick={closeMenu}
           >Discoveries
           </NavLink> 
           
           <NavLink to="all-species" className={pathname.includes("species")? "active":""}
           onClick={closeMenu}
           >
           Species
           </NavLink>



        </div>


        <div className="navbar-account">
          {user ? (
            <>
              <div className="navbar-user">
                <span>{user.username}</span>
                <small>{user.role}</small>
              </div>
              {user.role === "admin" && (
                <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
              )}
              <button type="button" className="navbar-action" onClick={signOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-up" onClick={closeMenu}>Sign Up</Link>
              <Link to="/sign-in" className="navbar-action" onClick={closeMenu}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
