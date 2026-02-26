import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    Hotel,
    CalendarCheck,
    Users as UsersIcon,
    CreditCard,
    FileText,
    Bell,
    Settings,
    ShieldCheck,
    ShieldAlert,
    ChevronLeft,
    Menu,
    LogOut,
    BarChart3
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isPinned, setIsPinned }) => {
    const [isHovered, setIsHovered] = useState(false);

    const menuItems = [
        { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/' },
        { icon: <Home size={22} />, label: 'Properties', path: '/properties' },
        { icon: <Hotel size={22} />, label: 'Hotels', path: '/hotels' },
        { icon: <CalendarCheck size={22} />, label: 'Bookings', path: '/bookings' },
        { icon: <UsersIcon size={22} />, label: 'Guests', path: '/users' },
        { icon: <CreditCard size={22} />, label: 'Payments', path: '/payments' },
        { icon: <ShieldAlert size={22} />, label: 'Disputes', path: '/disputes' },
        { icon: <BarChart3 size={22} />, label: 'Analytics', path: '/analytics' },
        { icon: <FileText size={22} />, label: 'Reports', path: '/reports' },
        { icon: <Bell size={22} />, label: 'Notifications', path: '/notifications' },
    ];

    const isExpanded = isPinned || isHovered;

    return (
        <aside
            className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isPinned ? 'pinned' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="sidebar-header" onClick={() => setIsPinned(!isPinned)}>
                <div className="logo-icon">
                    <ShieldCheck color="#0288AC" size={24} fill="#0288AC" fillOpacity={0.2} />
                </div>
                {isExpanded && <span className="logo-text">SOMSTAY</span>}
                {isExpanded && (
                    <button className="pin-toggle">
                        {isPinned ? <ChevronLeft size={18} /> : <Menu size={18} />}
                    </button>
                )}
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            title={!isExpanded ? item.label : ''}
                        >
                            <span className="item-icon">{item.icon}</span>
                            {isExpanded && <span className="item-label">{item.label}</span>}
                        </NavLink>
                    ))}
                </div>

                <div className="nav-footer">
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        title={!isExpanded ? 'Settings' : ''}
                    >
                        <span className="item-icon"><Settings size={22} /></span>
                        {isExpanded && <span className="item-label">Settings</span>}
                    </NavLink>

                    <button
                        className="nav-item logout-btn"
                        title={!isExpanded ? 'Logout' : ''}
                        style={{ border: 'none', background: 'transparent', width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', marginLeft: '7px', marginTop: '7px' }}
                        onClick={() => {
                            // Clear auth tokens/session here
                            console.log('Logging out...');
                            window.location.href = '/login'; // Or use navigate if possible
                        }}
                    >
                        <span className="item-icon"><LogOut size={22} color="#FE3335" /></span>
                        {isExpanded && <span className="item-label" style={{ color: '#FE3335', fontWeight: '600', fontSize: '15px', }}>Logout</span>}
                    </button>

                    <div className="user-profile">
                        <div className="user-avatar">
                            <img src="https://ui-avatars.com/api/?name=Bikin+Cake&background=white&color=0288AC" alt="User" />
                        </div>
                        {isExpanded && (
                            <div className="user-details">
                                <span className="user-name">Bikin Cake</span>
                                <span className="user-role">Super Admin</span>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
