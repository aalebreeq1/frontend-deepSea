import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { logout } from "./services/authService";

// Abdulla's pages
import AllMission from "./pages/MissionPages/AllMission";
import MissionDetails from "./pages/MissionPages/MissionDetails";

import AllSubmarines from "./pages/submarines/AllSubmarines";
import SubmarinesDetails from "./pages/submarines/SubmarinesDetails";

// Zainab's pages
import AllEquipment from "./pages/equipmentPages/AllEquipments";
import EquipmentDetails from "./pages/equipmentPages/EquipmentDetails";

import AllLocations from "./pages/locationPages/AllLocations";
import LocationDetails from "./pages/locationPages/LocationDetails";

import AllUsers from "./pages/UserPages/AllUsers";
import CreateUser from "./pages/UserPages/CreateUser";
import UpdateUser from "./pages/UserPages/UpdateUser";
import UserDetails from "./pages/UserPages/UserDetails";

//Nawraa's pages 
import AllDiscovery from "./pages/discoveryPages/AllDiscovery";
import CreateDiscovery from "./pages/discoveryPages/CreateDiscovery";
import DiscoveryDetails from "./pages/discoveryPages/DiscoveryDeatials";
import UpdateDiscovery from "./pages/discoveryPages/UpdateDiscovery";

import AllSpecies from "./pages/speciesPages/AllSpecies";
import CreateSpecies from "./pages/speciesPages/CreateSpecies";
import SpeciesDetails from "./pages/speciesPages/SpeciesDeatails";
import UpdateSpecies from "./pages/speciesPages/UpdateDetails";


function App() {
  const { pathname } = useLocation();
  const isAuthPage = ["/sign-in", "/sign-up", "/sign-in/", "/sign-up/"].includes(pathname);

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
      {!isAuthPage && <Navbar user={user} handleLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage setUser={setUser} />} />

        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/sign-in" />}
        />

        <Route path="/all-missions" element={<AllMission user={user} />} />
        <Route path="/mission/:id" element={<MissionDetails user={user} />} />

        <Route path="/all-submarines" element={<AllSubmarines user={user} />} />
        <Route path="/submarines/:id" element={<SubmarinesDetails user={user} />} />

        <Route path="/equipments" element={<AllEquipment user={user}/>} />
        <Route path="/equipments/:equipmentId" element={<EquipmentDetails user={user}/>} />

        <Route path="/locations" element={<AllLocations user={user}/>} />
        <Route path="/locations/:locationId/" element={<LocationDetails user={user}/>} />

        //USER Routes
        <Route path="/users" element={<AllUsers />} />
        <Route path="/users/new" element={<CreateUser />} />
        <Route path="/users/:userId/edit" element={<UpdateUser />} />
        <Route path="/users/:userId" element={<UserDetails />} />

        <Route path="*" element={<NotFound />} />


        //Discovery Routes
        <Route path="/all-discoveries" element={<AllDiscovery/>}/>
        <Route path="/create-discovery" element={<CreateDiscovery/>}/>
        <Route path="/discovery/:id" element={<DiscoveryDetails user={user}/>}/>
        <Route path="/update-discovery/:id" element={<UpdateDiscovery />}/>
        
        //Species Routes
        <Route path="/all-species" element={<AllSpecies/>}/>
        <Route path="/create-species" element={<CreateSpecies/>}/>
        <Route path="/species/:id" element={<SpeciesDetails user={user}/>}/>
        <Route path="/update-species/:id" element={<UpdateSpecies/>}/>



      </Routes>
    </div>
  );
}

export default App;
