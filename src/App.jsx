import { useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import { logout } from "./services/authService";
// Abdulla's pages
import AllMission from "./pages/MissionPages/AllMission";
import MissionDetails from "./pages/MissionPages/MissionDetails";
import CreateMission from "./pages/MissionPages/CreateMission";
import UpdateMission from "./pages/MissionPages/updateMission";

import AllSubmarines from "./pages/submarines/AllSubmarines"
import CreateSubmarines from "./pages/submarines/CreateSubmarines"
import UpdateSubmarines from "./pages/submarines/UpdateSubmarines"
import SubmarinesDetails from "./pages/submarines/SubmarinesDetails"

// Zainab's pages
import AllEquipment from "./pages/equipmentPages/AllEquipments";
import CreateEquipment from "./pages/equipmentPages/CreateEquipment";

function App() {
  function getUserFromToken() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    return JSON.parse(atob(token.split(".")[1]));
  }

  const [user, setUser] = useState(getUserFromToken());

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <div>
      <Navbar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage setUser={setUser} />} />

        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/sign-in" />}
        />

        <Route path="/all-missions" element={<AllMission />} />
        <Route path="/mission/:id" element={<MissionDetails user={user} />} />
        <Route path="/create-mission" element={<CreateMission user={user} />} />
        <Route path="/update-mission/:id" element={<UpdateMission user={user} />} />

        <Route path="/all-submarines" element={<AllSubmarines />} />
        <Route path="/create-submarines" element={<CreateSubmarines user={user}/>} />
        <Route path="/update-submarines/:id" element={<UpdateSubmarines user={user}/>} />
        <Route path="/submarines/:id" element={<SubmarinesDetails user={user} />} />

        <Route path="/equipments" element={<AllEquipment />} />
        <Route path="/equipments/new" element={<CreateEquipment />} />
        <Route path="/equipments/:equipmentId/edit" element={<UpdateEquipment />} />
      </Routes>
    </div>
  );
}

export default App;
