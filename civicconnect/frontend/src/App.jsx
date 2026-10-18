import React from 'react';

export default function App() {
    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar glass-panel">
                <div className="logo">
                    <span className="material-symbols-outlined icon-blue">location_city</span>
                    <h2>CivicConnect</h2>
                </div>
                <nav className="nav-menu">
                    <a href="#" className="nav-item active"><span className="material-symbols-outlined">dashboard</span> Dashboard</a>
                    <a href="submit-request.html" className="nav-item"><span className="material-symbols-outlined">add_box</span> Submit Request</a>
                    <a href="my-requests.html" className="nav-item"><span className="material-symbols-outlined">list_alt</span> My Requests</a>
                    <a href="messages.html" className="nav-item"><span className="material-symbols-outlined">mail</span> Messages</a>
                    <a href="settings.html" className="nav-item"><span className="material-symbols-outlined">settings</span> Settings</a>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="top-header glass-panel">
                    <div className="header-left"><h3>City of Cape Town Portal</h3></div>
                    <div className="header-right">
                        <div className="user-profile">
                            <img src="https://ui-avatars.com/api/?name=Nickyle+Kannemeyer&background=0D8ABC&color=fff" alt="User" />
                            <div className="user-info">
                                <strong>Nickyle Kannemeyer</strong>
                                <span>Citizen</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="dashboard-header">
                    <div>
                        <h1>Welcome back, Nickyle!</h1>
                        <p className="subtitle">Submit, track, and manage your community service requests.</p>
                    </div>
                    <button className="btn-primary" onClick={() => window.location.href='submit-request.html'}>
                        <span className="material-symbols-outlined">add</span> Submit New Request
                    </button>
                </div>

                {/* Metrics Grid */}
                <div className="metrics-grid">
                    <div className="glass-panel metric-card highlight-card">
                        <div className="metric-icon blue"><span className="material-symbols-outlined">description</span></div>
                        <div className="metric-data">
                            <span className="metric-label">Total Requests</span>
                            <span className="metric-value">5</span>
                        </div>
                    </div>
                    <div className="glass-panel metric-card open-card">
                        <div className="metric-icon yellow"><span className="material-symbols-outlined">schedule</span></div>
                        <div className="metric-data">
                            <span className="metric-label">Open</span>
                            <span className="metric-value">2</span>
                        </div>
                    </div>
                    <div className="glass-panel metric-card">
                        <div className="metric-icon orange"><span className="material-symbols-outlined">sync</span></div>
                        <div className="metric-data">
                            <span className="metric-label">In Progress</span>
                            <span className="metric-value">1</span>
                        </div>
                    </div>
                    <div className="glass-panel metric-card resolved-card">
                        <div className="metric-icon green"><span className="material-symbols-outlined">check_circle</span></div>
                        <div className="metric-data">
                            <span className="metric-label">Resolved</span>
                            <span className="metric-value">2</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}