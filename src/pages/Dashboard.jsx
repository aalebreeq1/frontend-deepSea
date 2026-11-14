
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

import { getAllUsers } from '../services/userServices';
import { getAllEquipments } from '../services/equipmentServices';
import { getAllLocations } from '../services/locationServices';
import { getAllSubmarines } from '../services/submarineService';
import { getAllMissions } from '../services/MissionService';
import { getAllSpecies } from '../services/speciesService';
import { getAllDiscoveries } from '../services/discoveryService';
import DashboardOverview from '../components/DashboardOverview'

const MODELS = [
    { id: 'overview', label: 'Dashboard Overview', icon: '🌊' },
    { id: 'expeditions', label: 'Expeditions', icon: '🧭' },
    { id: 'discoveries', label: 'Discoveries', icon: '💎' },
    { id: 'species', label: 'Species', icon: '🪼' },
    { id: 'submarines', label: 'Submarines', icon: '🛥️' },
    { id: 'equipment', label: 'Equipment', icon: '🔦' },
    { id: 'locations', label: 'Locations', icon: '📍' },
    { id: 'users', label: 'Users & Access', icon: '👥' },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');

    const [users, setUsers] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [locations, setLocations] = useState([]);
    const [submarines, setSubmarines] = useState([]);
    const [missions, setMissions] = useState([]);
    const [discoveries, setDiscoveries] = useState([]);
    const [species, setSpecies] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadDashboardData() {
            const results = await Promise.allSettled([
                getAllUsers(),
                getAllEquipments(),
                getAllLocations(),
                getAllSubmarines(),
                getAllMissions(),
                getAllDiscoveries(),
                getAllSpecies()
            ]);
            console.log('Discoveries API:', results[5]);
            console.log('Species API:', results[6]);

            if (results[0].status === 'fulfilled') {
                setUsers(results[0].value);
            } else {
                console.error('Users error:', results[0].reason);
            }

            if (results[1].status === 'fulfilled') {
                setEquipment(results[1].value);
            } else {
                console.error('Equipment error:', results[1].reason);
            }

            if (results[2].status === 'fulfilled') {
                setLocations(results[2].value);
            } else {
                console.error('Locations error:', results[2].reason);
            }

            if (results[3].status === 'fulfilled') {
                setSubmarines(results[3].value.submarines);
            } else {
                console.error('Submarines error:', results[3].reason);
            }

            if (results[4].status === 'fulfilled') {
                setMissions(results[4].value);
            } else {
                console.error('Missions error:', results[4].reason);
            }
            if (results[5].status === 'fulfilled') {
                setDiscoveries(results[5].value);
            } else {
                console.error('Discoveries error:', results[5].reason);
            }
            if (results[6].status === 'fulfilled') {
                setSpecies(results[6].value);
                if (results[6].status === 'fulfilled') {
                    setSpecies(results[6].value);
                } else {
                    console.error('Species error:', results[6].reason);
                }
            } else {
                console.error('Species error:', results[6].reason);
            }
        }

        loadDashboardData();
    }, []);

    // Search users
    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Search missions
    const filteredMissions = missions.filter(mission =>
        mission.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="ds-layout">

            {/* Sidebar */}
            <aside className="ds-sidebar">

                <div className="ds-brand">
                    <span className="ds-logo-icon">🤿</span>

                    <div>
                        <h2>DEEP SEA</h2>
                        <span className="ds-badge">Admin Console</span>
                    </div>
                </div>

                <nav className="ds-nav">

                    {MODELS.map((item) => {

                        const counts = {
                            expeditions: missions.length,
                            submarines: submarines.length,
                            equipment: equipment.length,
                            locations: locations.length,
                            users: users.length,
                            discoveries: discoveries.length,
                            species: species.length
                        };

                        return (
                            <button
                                key={item.id}
                                className={`ds-nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className="ds-nav-icon">{item.icon}</span>
                                <span className="ds-nav-text">{item.label}</span>

                                {counts[item.id] !== undefined && (
                                    <span className="ds-nav-count">
                                        {counts[item.id]}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="ds-sidebar-footer">
                    <div className="ds-live-indicator">
                        <span className="pulse-dot"></span>
                        <span>DeepSea Admin</span>
                    </div>
                </div>

            </aside>

            {/* Main Content */}
            <main className="ds-main">

                {/* Header */}
                <header className="ds-header">

                    <div>
                        <h1>
                            {MODELS.find(m => m.id === activeTab)?.label}
                        </h1>

                        <p className="ds-subtitle">
                            Manage deep-sea telemetry, public records, and platform permissions.
                        </p>
                    </div>

                    <div className="ds-header-actions">

                        <input
                            type="text"
                            placeholder="Search records..."
                            className="ds-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </div>

                </header>


                {loading ? (
                    <p>Loading dashboard data...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        {/* DASHBOARD OVERVIEW */}
                        {activeTab === 'overview' && (
                            <DashboardOverview
                                users={users}
                                missions={missions}
                                submarines={submarines}
                                equipment={equipment}
                                locations={locations}
                                discoveries={discoveries}
                                species={species}
                            />
                        )}
                        {/* USERS */}
                        {activeTab === 'users' && (
                            <section className="ds-card ds-section">
                                <h2>Users & Access</h2>

                                <table className="ds-table">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Specialization</th>
                                            <th>Institution</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user._id}>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.specialization || 'N/A'}</td>
                                                <td>{user.institution || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredUsers.length === 0 && <p>No users found.</p>}
                            </section>
                        )}

                        {/* EXPEDITIONS */}
                        {activeTab === 'expeditions' && (
                            <section className="ds-card ds-section">
                                <h2>Expeditions</h2>

                                <table className="ds-table">
                                    <thead>
                                        <tr>
                                            <th>Mission</th>
                                            <th>Objective</th>
                                            <th>Location</th>
                                            <th>Submarine</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredMissions.map(mission => (
                                            <tr key={mission._id}>
                                                <td>{mission.title}</td>
                                                <td>{mission.objective}</td>
                                                <td>{mission.location?.name || 'N/A'}</td>
                                                <td>{mission.submarine?.name || 'N/A'}</td>
                                                <td>{mission.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredMissions.length === 0 && <p>No expeditions found.</p>}
                            </section>
                        )}

                        {/* SUBMARINES */}
                        {activeTab === 'submarines' && (
                            <section className="ds-card ds-section">
                                <h2>Submarines</h2>

                                <table className="ds-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Model</th>
                                            <th>Maximum Depth</th>
                                            <th>Capacity</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {submarines.map(submarine => (
                                            <tr key={submarine._id}>
                                                <td>{submarine.name}</td>
                                                <td>{submarine.model}</td>
                                                <td>{submarine.maxDepth}</td>
                                                <td>{submarine.capacity}</td>
                                                <td>{submarine.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {submarines.length === 0 && <p>No submarines found.</p>}
                            </section>
                        )}

                        {/* EQUIPMENT */}
                        {activeTab === 'equipment' && (
                            <section className="ds-card ds-section">
                                <h2>Equipment</h2>

                                <table className="ds-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Condition</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {equipment.map(item => (
                                            <tr key={item._id}>
                                                <td>{item.name}</td>
                                                <td>{item.category}</td>
                                                <td>{item.condition}</td>
                                                <td>{item.description || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {equipment.length === 0 && <p>No equipment found.</p>}
                            </section>
                        )}

                        {/* LOCATIONS */}
                        {activeTab === 'locations' && (
                            <section className="ds-card ds-section">
                                <h2>Research Locations</h2>

                                <table className="ds-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Ocean</th>
                                            <th>Latitude</th>
                                            <th>Longitude</th>
                                            <th>Depth</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {locations.map(location => (
                                            <tr key={location._id}>
                                                <td>{location.name}</td>
                                                <td>{location.ocean}</td>
                                                <td>{location.latitude}</td>
                                                <td>{location.longitude}</td>
                                                <td>{location.depth ?? 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {locations.length === 0 && <p>No locations found.</p>}
                            </section>
                        )}

                        {/* DISCOVERIES */}
                        {activeTab === 'discoveries' && (
                            <section className="ds-card ds-section">
                                <h2>Discoveries</h2>

                                <table className="ds-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Type</th>
                                            <th>Description</th>
                                            <th>Date</th>
                                            <th>Mission</th>
                                            <th>Species</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {discoveries.map(discovery => (
                                            <tr key={discovery._id}>
                                                <td>{discovery.title}</td>
                                                <td>{discovery.discoveryType}</td>
                                                <td>{discovery.description}</td>
                                                <td>
                                                    {new Date(discovery.discoveryDate).toLocaleDateString()}
                                                </td>
                                                <td>{discovery.mission?.title || 'N/A'}</td>
                                                <td>
                                                    {discovery.species?.length
                                                        ? discovery.species.map(species => species.name).join(', ')
                                                        : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {discoveries.length === 0 && <p>No discoveries found.</p>}
                            </section>
                        )}

                        {/* SPECIES */}
                        {activeTab === 'species' && (
                            <section className="ds-card ds-section">
                                <h2>Species</h2>

                                <table className="ds-table">
                                    <thead>
                                        <tr>
                                            <th>Common Name</th>
                                            <th>Scientific Name</th>
                                            <th>Classification</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {species.map(item => (
                                            <tr key={item._id}>
                                                <td>{item.commonName || 'N/A'}</td>
                                                <td>{item.scientificName}</td>
                                                <td>{item.classification}</td>
                                                <td>{item.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {species.length === 0 && <p>No species found.</p>}
                            </section>
                        )}
                    </>
                )}


            </main>

        </div>
    );
}
