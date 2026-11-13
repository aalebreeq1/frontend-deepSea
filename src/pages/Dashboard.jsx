// import { useState, useEffect } from 'react';
// import { getDashboard } from '../services/dashboardService';
// import { Link } from 'react-router';
// import './Dashboard.css';

// function label(value = '') {
//     return value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
// }

// function toArray(obj = {}) {
//     return Object.entries(obj)
//         .map(([name, count]) => ({ name, count }))
//         .sort((a, b) => b.count - a.count);
// }

// function formatDate(value) {
//     return value ? new Date(value).toLocaleDateString() : '';
// }

// function Tile({ label: text, value, icon, tone }) {
//     return (
//         <div className="db-card db-stat">
//             <div className={`db-stat-icon ${tone}`}>{icon}</div>
//             <div>
//                 <p className="db-muted">{text}</p>
//                 <h3>{value}</h3>
//             </div>
//         </div>
//     );
// }

// function Panel({ title, subtitle, children, wide = false }) {
//     return (
//         <div className={`db-card ${wide ? 'db-card-wide' : ''}`}>
//             <h3>{title}</h3>
//             {subtitle && <p className="db-muted">{subtitle}</p>}
//             {children}
//         </div>
//     );
// }

// function BarList({ items }) {
//     const max = Math.max(1, ...items.map((i) => i.count));
//     return (
//         <div className="db-bars">
//             {items.map((item) => (
//                 <div className="db-bar-row" key={item.name}>
//                     <span>{label(item.name)}</span>
//                     <div className="db-bar-track">
//                         <div className="db-bar-fill" style={{ width: `${(item.count / max) * 100}%` }} />
//                     </div>
//                     <span className="db-muted">{item.count}</span>
//                 </div>
//             ))}
//         </div>
//     );
// }

// function Dashboard() {
//     const [data, setData] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         let active = true;

//         getDashboard()
//             .then((res) => { if (active) setData(res); })
//             .catch(() => { if (active) setError('Failed to load dashboard data.'); });

//         return () => {
//             active = false;
//         };
//     }, []);

//     const totals = data?.totals || {};
//     const condition = data?.equipment?.condition || {};
//     const pctOp = totals.equipment ? (condition.operational / totals.equipment) * 100 : 0;
//     const pctMaint = totals.equipment ? (condition.needs_maintenance / totals.equipment) * 100 : 0;
//     const donutStyle = {
//         background: `conic-gradient(
//             #4ade80 0% ${pctOp}%,
//             #fbbf24 ${pctOp}% ${pctOp + pctMaint}%,
//             #f87171 ${pctOp + pctMaint}% 100%
//         )`
//     };

//     return (
//         <div className="db">

//             <aside className="db-sidebar">
//                 <div className="db-logo">DeepSea</div>
//                 <nav className="db-nav">
//                     <Link className="db-nav-item active" to="/dashboard">Dashboard</Link>
//                     <Link className="db-nav-item" to="/equipments">Equipment</Link>
//                     <Link className="db-nav-item" to="/submarines">Submarines</Link>
//                 </nav>
//             </aside>

//             <main className="db-main">
//                 <header className="db-header">
//                     <p className="db-breadcrumb">Pages / Dashboard</p>
//                     <h1>Dashboard</h1>
//                 </header>

//                 {error && <p className="db-muted">{error}</p>}
//                 {!data && !error && <p className="db-muted">Loading dashboard...</p>}

//                 {data && (
//                     <>
//                         <section className="db-stats">
//                             <Tile label="Equipment" value={totals.equipment} icon="◎" tone="blue" />
//                             <Tile label="Submarines" value={totals.submarines} icon="▲" tone="cyan" />
//                             <Tile label="Missions" value={totals.missions} icon="⚑" tone="violet" />
//                             <Tile label="Discoveries" value={totals.discoveries} icon="✦" tone="green" />
//                             <Tile label="Locations" value={totals.locations} icon="⌖" tone="amber" />
//                             <Tile label="Species" value={totals.species} icon="❋" tone="rose" />
//                             <Tile label="Users" value={totals.users} icon="◐" tone="cyan" />
//                         </section>

//                         <section className="db-grid">
//                             <Panel title="Equipment health" subtitle="Share of equipment by condition">
//                                 <div className="db-donut-wrap">
//                                     <div className="db-donut" style={donutStyle}>
//                                         <div className="db-donut-center">
//                                             <strong>{Math.round(pctOp)}%</strong>
//                                             <span className="db-muted">Operational</span>
//                                         </div>
//                                     </div>
//                                     <div className="db-legend">
//                                         <span style={{ '--dot': '#4ade80' }}>Operational: {condition.operational || 0}</span>
//                                         <span style={{ '--dot': '#fbbf24' }}>Needs maintenance: {condition.needs_maintenance || 0}</span>
//                                         <span style={{ '--dot': '#f87171' }}>Out of service: {condition.out_of_service || 0}</span>
//                                     </div>
//                                 </div>
//                             </Panel>

//                             <Panel title="Submarine status" subtitle="Fleet breakdown">
//                                 <BarList items={toArray(data.submarines.status)} />
//                             </Panel>
//                         </section>

//                         <section className="db-grid-bottom">
//                             <Panel title="Missions by status" subtitle="Planned, active, completed, and suspended">
//                                 <BarList items={toArray(data.missions.status)} />
//                             </Panel>

//                             <Panel title="Discoveries by type" subtitle="What was found on expeditions">
//                                 <BarList items={toArray(data.discoveries.type)} />
//                             </Panel>
//                         </section>

//                         <section className="db-grid-bottom">
//                             <Panel title="Equipment by category" subtitle="Items in each category">
//                                 <BarList items={toArray(data.equipment.category)} />
//                             </Panel>

//                             <Panel title="Species by classification" subtitle="Recorded species">
//                                 <BarList items={toArray(data.species.classification)} />
//                             </Panel>
//                         </section>

//                         <section className="db-grid-bottom">
//                             <Panel title="Locations by ocean" subtitle="Where missions are based">
//                                 <BarList items={toArray(data.locations.ocean)} />
//                             </Panel>

//                             <Panel title="Users by role" subtitle="Accounts on the platform">
//                                 <BarList items={toArray(data.users.role)} />
//                             </Panel>
//                         </section>

//                         <section className="db-grid-bottom">
//                             <Panel title="Recent discoveries" subtitle="Latest five">
//                                 <div className="db-list">
//                                     {data.recentDiscoveries.length === 0 && (
//                                         <p className="db-muted">No discoveries yet.</p>
//                                     )}
//                                     {data.recentDiscoveries.map((d) => (
//                                         <div className="db-row db-row-3" key={d._id}>
//                                             <div>
//                                                 <span className="db-row-name">{d.title}</span>
//                                                 <p className="db-muted">{d.mission?.title} · {formatDate(d.discoveryDate)}</p>
//                                             </div>
//                                             <span className="db-badge neutral">{d.discoveryType}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </Panel>

//                             <Panel title="Recent missions" subtitle="Latest five">
//                                 <div className="db-list">
//                                     {data.recentMissions.length === 0 && (
//                                         <p className="db-muted">No missions yet.</p>
//                                     )}
//                                     {data.recentMissions.map((m) => (
//                                         <div className="db-row db-row-3" key={m._id}>
//                                             <div>
//                                                 <span className="db-row-name">{m.title}</span>
//                                                 <p className="db-muted">{m.submarine?.name}</p>
//                                             </div>
//                                             <span className={`db-badge ${m.status}`}>{label(m.status)}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </Panel>
//                         </section>
//                     </>
//                 )}
//             </main>

//         </div>
//     );
// }

// export default Dashboard;