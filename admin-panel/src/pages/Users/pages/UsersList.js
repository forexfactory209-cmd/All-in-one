import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, UserPlus, Users, RefreshCw, ChevronLeft, ChevronDown, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { userService } from '../services/userService';
import UsersTable from '../sections/UsersTable';
import AddGuestPopup from '../popups/AddGuestPopup';
import PageHeader from '../../../components/PageHeader';
import { exportToCSV } from '../../../utils/exportUtils';
import './UsersPage.css';

const USERS_PER_PAGE = 7;

const UsersList = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('All Guests');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [cityFilter, setCityFilter] = useState('All Cities');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleExportCSV = () => {
        const exportData = users.map(u => ({
            'Guest ID': u.id,
            'Full Name': u.name,
            'Email': u.email,
            'Phone': u.phone,
            'City': u.city,
            'Booking Count': u.bookings,
            'Last Activity': u.lastActivity,
            'Status': u.status
        }));
        exportToCSV(exportData, 'SomStay_Guests_Report');
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAllUsers();
            const mappedUsers = data.map(user => ({
                ...user,
                id: `GS-${String(user.id).padStart(4, '0')}`,
                dbId: user.id,
                name: user.full_name,
                phone: user.phone || 'N/A',
                city: user.city || 'Unknown',
                bookings: user.booking_count || 0,
                lastActivity: user.last_booking ? new Date(user.last_booking).toLocaleDateString() : 'No bookings',
                status: user.status === 'Active' ? 'ACTIVE' : (user.status || 'INACTIVE').toUpperCase(),
                avatar: user.avatar || null
            }));
            setUsers(mappedUsers);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const uniqueCities = ['All Cities', ...new Set(users.map(u => u.city).filter(c => c && c !== 'Unknown'))];

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this guest record?')) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    const handleEditUser = (user) => {
        setSelectedGuest(user);
        setIsPopupOpen(true);
    };

    const handleAddUser = () => {
        setSelectedGuest(null);
        setIsPopupOpen(true);
    };

    const tabs = [
        { name: 'All Guests', count: users.length },
        { name: 'With Rentals', count: users.filter(u => u.bookings > 0).length },
        { name: 'Incomplete Profiles', count: users.filter(u => !u.phone || u.phone === 'N/A').length }
    ];

    const filteredUsers = users.filter(u => {
        const matchesTab =
            activeTab === 'All Guests' ||
            (activeTab === 'With Rentals' && u.bookings > 0) ||
            (activeTab === 'Incomplete Profiles' && (!u.phone || u.phone === 'N/A'));

        const matchesStatus = statusFilter === 'All' || u.status === statusFilter.toUpperCase();

        const matchesCity = cityFilter === 'All Cities' || u.city === cityFilter;

        const matchesSearch =
            !searchQuery ||
            u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.city?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch && matchesStatus && matchesCity;
    });

    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const recentlyJoined = users.filter(u => {
        const regDate = new Date(u.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return regDate > thirtyDaysAgo;
    }).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="users-container"
        >
            <PageHeader
                icon={<Users size={22} />}
                title="Guest Directory"
                subtitle="Manage verified guest profiles and property rental history"
                stats={[
                    { value: String(users.length), label: 'Total Guests' },
                    { value: String(users.filter(u => u.status === 'ACTIVE').length), label: 'Active' },
                    { value: String(recentlyJoined), label: 'New (30d)' }
                ]}
                actions={[
                    <button key="export" className="phb-action-btn secondary" onClick={handleExportCSV}>
                        <Download size={17} />
                        <span>Export CSV</span>
                    </button>,
                    <button key="add" className="phb-action-btn" onClick={handleAddUser}>
                        <UserPlus size={17} />
                        <span>Add Guest</span>
                    </button>
                ]}
            />

            {/* Tabs Row */}
            <div className="gs-tabs-row">
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        className={`gs-tab ${activeTab === tab.name ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab(tab.name);
                            setStatusFilter('All');
                            setCityFilter('All Cities');
                            setCurrentPage(1);
                        }}
                    >
                        {tab.name}
                        {tab.count !== null && (
                            <span className={`gs-tab-badge ${activeTab === tab.name ? 'active-badge' : ''}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Search + Filter Bar */}
            <div className="gs-filter-bar">
                <div className="gs-search-input">
                    <Search size={16} className="gs-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone or city..."
                        value={searchQuery}
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="gs-filter-actions">
                    <div className="dropdown-container">
                        <button className="gs-outline-btn" onClick={() => {
                            setShowStatusDropdown(!showStatusDropdown);
                            setShowCityDropdown(false);
                        }}>
                            <Filter size={16} />
                            <span>{statusFilter}</span>
                            <ChevronDown size={14} />
                        </button>
                        {showStatusDropdown && (
                            <div className="status-dropdown">
                                {['All', 'Active', 'Inactive', 'Blocked'].map(status => (
                                    <div
                                        key={status}
                                        className="status-item"
                                        onClick={() => {
                                            setStatusFilter(status);
                                            setShowStatusDropdown(false);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {status}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dropdown-container">
                        <button className="gs-outline-btn" onClick={() => {
                            setShowCityDropdown(!showCityDropdown);
                            setShowStatusDropdown(false);
                        }}>
                            <MapPin size={16} />
                            <span>{cityFilter}</span>
                            <ChevronDown size={14} />
                        </button>
                        {showCityDropdown && (
                            <div className="status-dropdown">
                                {uniqueCities.map(city => (
                                    <div
                                        key={city}
                                        className="status-item"
                                        onClick={() => {
                                            setCityFilter(city);
                                            setShowCityDropdown(false);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {city}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="gs-outline-btn icon-only" onClick={fetchUsers} title="Refresh Data">
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    </button>
                    <button className="gs-outline-btn" onClick={handleExportCSV}>
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="gs-table-card">
                <UsersTable
                    users={paginatedUsers}
                    loading={loading}
                    onDelete={handleDeleteUser}
                    onEdit={handleEditUser}
                />
                <div className="gs-table-footer">
                    <span className="gs-showing-info">
                        Showing <strong>{startIndex + 1} to {Math.min(startIndex + USERS_PER_PAGE, filteredUsers.length)}</strong> of <strong>{filteredUsers.length}</strong> guests
                    </span>
                    <div className="pagination">
                        <button className="page-nav-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                            <ChevronLeft size={16} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`page-num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => goToPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button className="page-nav-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
                            <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                    </div>
                </div>
            </div>

            <AddGuestPopup
                isOpen={isPopupOpen}
                onClose={() => {
                    setIsPopupOpen(false);
                    setSelectedGuest(null);
                }}
                onSuccess={fetchUsers}
                editData={selectedGuest}
            />
        </motion.div>
    );
};

export default UsersList;
