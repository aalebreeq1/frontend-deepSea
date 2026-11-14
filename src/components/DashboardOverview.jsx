
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';

import './DashboardOverview.css';

const COLORS = [
    '#087E8B',
    '#36BFC0',
    '#75B9A8',
    '#E39A70',
    '#0B2538'
];

function DashboardOverview({
    users = [],
    missions = [],
    submarines = [],
    equipment = [],
    locations = [],
    discoveries = [],
    species = []
}) {

    // Mission activity by month
    const missionActivity = missions.reduce((acc, mission) => {
        if (!mission.startDate) return acc;

        const date = new Date(mission.startDate);
        const month = date.toLocaleString('en', { month: 'short' });
        const year = date.getFullYear();
        const key = `${year}-${date.getMonth()}`;

        const existing = acc.find(item => item.key === key);

        if (existing) {
            existing.missions += 1;
        } else {
            acc.push({
                key,
                month: `${month} ${year}`,
                missions: 1,
                date: new Date(year, date.getMonth(), 1)
            });
        }

        return acc;
    }, []).sort((a, b) => a.date - b.date).slice(-6);

    // Missions by ocean
    const missionsByOcean = Object.values(
        missions.reduce((acc, mission) => {
            const ocean = mission.location?.ocean || 'Unknown';

            if (!acc[ocean]) {
                acc[ocean] = { name: ocean, missions: 0 };
            }

            acc[ocean].missions += 1;
            return acc;
        }, {})
    );

    // Submarine status
    const submarineStatus = Object.values(
        submarines.reduce((acc, submarine) => {
            const status = submarine.status || 'Unknown';

            if (!acc[status]) {
                acc[status] = {
                    name: status.replaceAll('_', ' '),
                    value: 0
                };
            }

            acc[status].value += 1;
            return acc;
        }, {})
    );

    // Equipment condition
    const equipmentCondition = Object.values(
        equipment.reduce((acc, item) => {
            const condition = item.condition || 'Unknown';

            if (!acc[condition]) {
                acc[condition] = {
                    name: condition.replaceAll('_', ' '),
                    value: 0
                };
            }

            acc[condition].value += 1;
            return acc;
        }, {})
    );

    // Location depth
    const locationDepth = locations
        .filter(location => location.depth !== undefined && location.depth !== null)
        .map(location => ({
            name: location.name,
            depth: location.depth
        }));

    // User roles
    const userRoles = Object.values(
        users.reduce((acc, user) => {
            const role = user.role || 'Unknown';

            if (!acc[role]) {
                acc[role] = { name: role, value: 0 };
            }

            acc[role].value += 1;
            return acc;
        }, {})
    );

    // Discovery types
    const discoveryTypes = Object.values(
        discoveries.reduce((acc, discovery) => {
            const type = discovery.discoveryType || 'Unknown';

            if (!acc[type]) {
                acc[type] = { name: type, count: 0 };
            }

            acc[type].count += 1;

            return acc;
        }, {})
    );

    // Species classifications
    const speciesClassifications = Object.values(
        species.reduce((acc, item) => {
            const classification = item.classification || 'Unknown';

            if (!acc[classification]) {
                acc[classification] = {
                    name: classification,
                    count: 0
                };
            }

            acc[classification].count += 1;

            return acc;
        }, {})
    );

    // Latest 4 species
    const latestSpecies = [...species]
        .sort((a, b) =>
            String(b._id || '').localeCompare(String(a._id || ''))
        )
        .slice(0, 4);

    // Empty chart message
    function EmptyChart({ message = 'No records available yet' }) {
        return <p className="chart-empty">{message}</p>;
    }

    // Dashboard chart card
    function ChartCard({ number, title, children, className = '' }) {
        return (
            <section className={`analytics-card ${className}`}>
                <div className="analytics-card-heading">
                    <span className="analytics-number">{number}</span>
                    <h3>{title}</h3>
                </div>

                {children}
            </section>
        );
    }

    return (
        <div className="analytics-dashboard">

            {/* 1. Expedition Overview */}
            <ChartCard
                number="01"
                title="Expedition Overview"
                className="area-one"
            >
                <div className="overview-stats">
                    <div>
                        <span>Total Missions</span>
                        <strong>{missions.length}</strong>
                    </div>

                    <div>
                        <span>Active Missions</span>
                        <strong>
                            {missions.filter(m => m.status === 'active').length}
                        </strong>
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>
                            {missions.filter(m => m.status === 'completed').length}
                        </strong>
                    </div>

                    <div>
                        <span>Planned</span>
                        <strong>
                            {missions.filter(m => m.status === 'planned').length}
                        </strong>
                    </div>
                </div>
            </ChartCard>

            {/* 2. Mission Distribution */}
            <ChartCard
                number="02"
                title="Mission Distribution"
                className="area-two"
            >
                {missionsByOcean.length > 0 ? (
                    <ResponsiveContainer width="100%" height={135}>
                        <BarChart data={missionsByOcean}>
                            <CartesianGrid
                                stroke="#293941"
                                strokeDasharray="3 3"
                            />
                            <XAxis dataKey="name" stroke="#82939B" />
                            <YAxis allowDecimals={false} stroke="#82939B" />
                            <Tooltip />
                            <Bar
                                dataKey="missions"
                                fill="#4DABB0"
                                radius={[5, 5, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <EmptyChart />
                )}
            </ChartCard>

            {/* 3. Submarine Fleet */}
            <ChartCard number="03" title="Submarine Fleet">
                {submarineStatus.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={submarineStatus}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                            >
                                {submarineStatus.map((item, index) => (
                                    <Cell
                                        key={item.name}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <EmptyChart />
                )}
            </ChartCard>

            {/* 4. Equipment Inventory */}
            <ChartCard number="04" title="Equipment Inventory">
                {equipmentCondition.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={equipmentCondition}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                            >
                                {equipmentCondition.map((item, index) => (
                                    <Cell
                                        key={item.name}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <EmptyChart />
                )}
            </ChartCard>

            {/* 6. Research Team */}
            <ChartCard
                number="06"
                title="Research Team"
                className="area-six"
            >
                {userRoles.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={userRoles}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                            >
                                {userRoles.map((item, index) => (
                                    <Cell
                                        key={item.name}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <EmptyChart />
                )}
            </ChartCard>

            {/* 7. Discoveries & Species */}
            <ChartCard
                number="07"
                title="Discoveries & Species"
                className="wide-card"
            >
                <div className="species-gallery">
                    {latestSpecies.length > 0 ? (
                        latestSpecies.map(item => (
                            <div
                                className="species-gallery-item"
                                key={item._id}
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={
                                            item.commonName ||
                                            item.scientificName
                                        }
                                    />
                                ) : (
                                    <div className="species-image-placeholder">
                                        🪼
                                    </div>
                                )}

                                <div className="species-gallery-info">
                                    <h4>
                                        {item.commonName || item.scientificName}
                                    </h4>

                                    <p>{item.scientificName}</p>

                                    <span>{item.classification}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyChart message="No species records available" />
                    )}
                </div>

                <p className="chart-note">
                    Showing {latestSpecies.length} latest species ·{' '}
                    {species.length} species recorded
                </p>
            </ChartCard>

            {/* 8. Database Summary */}
            <ChartCard number="08" title="DeepSea Database">
                <div className="database-summary">
                    <div>
                        <span>Users</span>
                        <strong>{users.length}</strong>
                    </div>

                    <div>
                        <span>Missions</span>
                        <strong>{missions.length}</strong>
                    </div>

                    <div>
                        <span>Submarines</span>
                        <strong>{submarines.length}</strong>
                    </div>

                    <div>
                        <span>Equipment</span>
                        <strong>{equipment.length}</strong>
                    </div>

                    <div>
                        <span>Locations</span>
                        <strong>{locations.length}</strong>
                    </div>

                    <div>
                        <span>Discoveries</span>
                        <strong>{discoveries.length}</strong>
                    </div>

                    <div>
                        <span>Species</span>
                        <strong>{species.length}</strong>
                    </div>
                </div>
            </ChartCard>

        </div>
    );
}

export default DashboardOverview;
