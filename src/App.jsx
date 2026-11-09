import { useState } from "react";
import { Navigate, Route, Routes } from "react-router";
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
import CreateMission from "./pages/MissionPages/CreateMission";
import UpdateMission from "./pages/MissionPages/updateMission";

import AllSubmarines from "./pages/submarines/AllSubmarines"
import CreateSubmarines from "./pages/submarines/CreateSubmarines"
import UpdateSubmarines from "./pages/submarines/UpdateSubmarines"
import SubmarinesDetails from "./pages/submarines/SubmarinesDetails"

// Zainab's pages
import AllEquipment from "./pages/equipmentPages/AllEquipments";
import CreateEquipment from "./pages/equipmentPages/CreateEquipment";
import UpdateEquipment from "./pages/equipmentPages/UpdateEquipment";
import EquipmentDetails from "./pages/equipmentPages/EquipmentDetails"

import AllLocations from "./pages/locationPages/AllLocations"
import CreateLocation from "./pages/locationPages/CreateLocation"
import UpdateLocation from "./pages/locationPages/UpdateLocation";
import LocationDetails from "./pages/locationPages/LocationDetails";


//Nawraa's pages 
import AllDiscovery from "./pages/discoveryPages/AllDiscovery";
import CreateDiscovery from "./pages/discoveryPages/createDiscovery";
import DiscoveryDetails from "./pages/discoveryPages/DiscoveryDeatials";
import UpdateDiscovery from "./pages/discoveryPages/UpdateDiscovery";


import AllSpecies from "./pages/speciesPages/AllSpecies";
import CreateSpecies from "./pages/speciesPages/CreateSpecies";
import SpeciesDetails from "./pages/speciesPages/SpeciesDeatails";
import UpdateSpecies from "./pages/speciesPages/UpdateDetails";


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

        <Route path="/all-missions" element={<AllMission user={user} />} />
        <Route path="/mission/:id" element={<MissionDetails user={user} />} />
        <Route path="/create-mission" element={<CreateMission user={user} />} />
        <Route path="/update-mission/:id" element={<UpdateMission user={user} />} />

        <Route path="/all-submarines" element={<AllSubmarines user={user} />} />
        <Route path="/create-submarines" element={<CreateSubmarines user={user} />} />
        <Route path="/update-submarines/:id" element={<UpdateSubmarines user={user} />} />
        <Route path="/submarines/:id" element={<SubmarinesDetails user={user} />} />
        // EQUIPMENT Routes
        <Route path="/equipments" element={<AllEquipment />} />
        <Route path="/equipments/new" element={<CreateEquipment user={user}/>} />
        <Route path="/equipments/:equipmentId/edit" element={<UpdateEquipment user={user}/>} />
        <Route path="/equipments/:equipmentId" element={<EquipmentDetails />} />
        // LOCATION Routes
        <Route path="/locations" element={<AllLocations />} />
        <Route path="/locations/new" element={<CreateLocation user={user}/>} />
        <Route path="/locations/:locationId/edit" element={<UpdateLocation user={user}/>} />
        <Route path="/locations/:locationId/" element={<LocationDetails />} />
        //USER Routes

        <Route path="*" element={<NotFound />} />





        //Discovery Routes
        <Route path="/all-discoveries" element={<AllDiscovery/>}/>
        <Route path="/create-discovery" element={<CreateDiscovery/>}/>
        <Route path="/discovery/:id" element={<DiscoveryDetails user={user}/>}/>
        <Route path="/update-discovery/:id" element={<UpdateDiscovery/>}/>
        
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
