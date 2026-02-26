import React, { useState, useEffect } from 'react';
import { Search, Settings, Trash2, Sliders, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationsTable from '../sections/NotificationsTable';
import { notificationService } from '../services/notificationService';
import PageHeader from '../../../components/PageHeader';
import './NotificationsPage.css';

const NotificationsPage = () => {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Unread', 'Critical', 'System'];

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, status: 'READ' })));
    };

    const handleMarkRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ' } : n));
    };

    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'Unread') return n.status === 'UNREAD';
        if (activeTab === 'Critical') return n.priority === 'HIGH';
        return true;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="notifications-page-container"
        >
            <PageHeader
                icon={<Bell size={22} />}
                title="Notifications Hub"
                subtitle="Real-time system alerts and operation signals"
                stats={[
                    { value: String(notifications.filter(n => n.status === 'UNREAD').length), label: 'Unread' },
                    { value: String(notifications.filter(n => n.priority === 'HIGH').length), label: 'Critical' }
                ]}
                actions={[
                    <button key="settings" className="phb-action-btn secondary">
                        <Settings size={16} />
                        <span>Settings</span>
                    </button>,
                    <button key="markall" className="phb-action-btn" onClick={handleMarkAllRead}>
                        <span>Mark All Read</span>
                    </button>
                ]}
            />

            {/* Quick Filter Tabs */}
            <div className="notif-tabs-row">
                <div className="tabs-main">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`notif-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                            {tab === 'Unread' && notifications.filter(n => n.status === 'UNREAD').length > 0 && (
                                <span className="tab-badge-unread">
                                    {notifications.filter(n => n.status === 'UNREAD').length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tool Bar */}
            <div className="notifications-toolbar">
                <div className="search-bar-rounded">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Filter alerts by keyword or ID..." />
                </div>

                <div className="toolbar-actions">
                    <button className="tool-btn-outline">
                        <Sliders size={18} />
                        <span>Preferences</span>
                    </button>
                    <button className="tool-btn-outline destructive">
                        <Trash2 size={18} />
                        <span>Clear All</span>
                    </button>
                </div>
            </div>

            {/* Notifications Feed */}
            <div className="notifications-feed-wrapper">
                <NotificationsTable
                    notifications={filteredNotifications}
                    loading={loading}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                />
            </div>

            {/* Pagination / Load More */}
            {!loading && filteredNotifications.length > 0 && (
                <div className="feed-footer-industrial">
                    <button className="load-more-btn">
                        <span>Load older notifications</span>
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default NotificationsPage;
