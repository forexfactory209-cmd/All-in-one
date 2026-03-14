import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    Globe,
    CalendarCheck,
    CreditCard,
    Bell,
    ShieldCheck,
    Database,
    Save,
    RotateCcw,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    Server,
    Cpu,
    Clock,
    Activity,
    Minus,
    Plus,
} from 'lucide-react';
import { settingsService } from '../services/settingsService';
import PageHeader from '../../../components/PageHeader';
import './SettingsPage.css';

/* ============================================================
   Helpers
   ============================================================ */

/** Parse a setting value into its correct JS type */
const parseValue = (value, type) => {
    if (type === 'boolean') return value === 'true';
    if (type === 'number') return Number(value) || 0;
    return value ?? '';
};

/** Stringify a value back for the API */
const stringifyValue = (value, type) => {
    if (type === 'boolean') return String(Boolean(value));
    return String(value);
};

/* ============================================================
   Sub-component: SettingField
   Renders the right input control for each setting based on value_type.
   ============================================================ */
const SettingField = ({ setting, value, onChange, saving }) => {
    const { key, label, description, value_type } = setting;

    if (value_type === 'boolean') {
        return (
            <div className="settings-field-row" key={key}>
                <div className="settings-field-label">
                    <strong>{label}</strong>
                    {description && <span>{description}</span>}
                </div>
                <div className="settings-toggle-wrapper">
                    <label className="settings-toggle" htmlFor={`toggle-${key}`}>
                        <input
                            id={`toggle-${key}`}
                            type="checkbox"
                            checked={!!value}
                            onChange={e => onChange(key, e.target.checked, value_type)}
                            disabled={saving}
                        />
                        <span className="settings-toggle-slider" />
                    </label>
                    <span className="settings-toggle-label">{value ? 'Enabled' : 'Disabled'}</span>
                </div>
            </div>
        );
    }

    if (value_type === 'number') {
        return (
            <div className="settings-field-row" key={key}>
                <div className="settings-field-label">
                    <strong>{label}</strong>
                    {description && <span>{description}</span>}
                </div>
                <div className="settings-number-input">
                    <button
                        className="settings-number-btn"
                        onClick={() => onChange(key, Math.max(0, Number(value) - 1), value_type)}
                        disabled={saving}
                        type="button"
                        aria-label={`Decrease ${label}`}
                    >
                        <Minus size={14} />
                    </button>
                    <input
                        className="settings-input"
                        type="number"
                        value={value}
                        onChange={e => onChange(key, e.target.value, value_type)}
                        disabled={saving}
                        style={{ textAlign: 'center' }}
                    />
                    <button
                        className="settings-number-btn"
                        onClick={() => onChange(key, Number(value) + 1, value_type)}
                        disabled={saving}
                        type="button"
                        aria-label={`Increase ${label}`}
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
        );
    }

    // Default: string input
    return (
        <div className="settings-field-row" key={key}>
            <div className="settings-field-label">
                <strong>{label}</strong>
                {description && <span>{description}</span>}
            </div>
            <input
                className="settings-input"
                type="text"
                value={value}
                onChange={e => onChange(key, e.target.value, value_type)}
                disabled={saving}
                placeholder={`Enter ${label.toLowerCase()}...`}
            />
        </div>
    );
};

/* ============================================================
   Sub-component: SettingsSection
   Card wrapping each settings group.
   ============================================================ */
const SettingsSection = ({ title, description, icon, fields, localValues, onChange, saving }) => (
    <div className="settings-section-card">
        <div className="settings-section-header">
            <div className="settings-section-icon">{icon}</div>
            <div className="settings-section-title-block">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
        <div className="settings-fields-grid">
            {fields.map(setting => (
                <SettingField
                    key={setting.key}
                    setting={setting}
                    value={localValues[setting.key]}
                    onChange={onChange}
                    saving={saving}
                />
            ))}
        </div>
    </div>
);

/* ============================================================
   Sub-component: SystemInfoPanel
   Read-only panel showing server and runtime info.
   ============================================================ */
const SystemInfoPanel = () => {
    const [uptime, setUptime] = useState('—');
    const [status, setStatus] = useState('checking');

    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch(
                    (process.env.REACT_APP_API_URL || 'http://localhost:9050/api') + '/health'
                );
                const data = await res.json();
                if (data.success) {
                    const sec = Math.floor(data.data?.uptime || 0);
                    const h = Math.floor(sec / 3600);
                    const m = Math.floor((sec % 3600) / 60);
                    setUptime(`${h}h ${m}m`);
                    setStatus('online');
                } else {
                    setStatus('offline');
                }
            } catch {
                setStatus('offline');
            }
        };
        check();
    }, []);

    const infoCards = [
        { icon: <Server size={18} />, label: 'Backend', value: 'Node.js + Express' },
        { icon: <Database size={18} />, label: 'Database', value: 'MySQL (mysql2)' },
        { icon: <Cpu size={18} />, label: 'Admin Panel', value: 'React 18' },
        { icon: <Clock size={18} />, label: 'Server Uptime', value: uptime },
        {
            icon: <Activity size={18} />, label: 'API Status', value: (
                <span className={`settings-status-badge ${status === 'online' ? 'online' : 'offline'}`}>
                    <span className="settings-status-dot" />
                    {status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking…'}
                </span>
            )
        },
        { icon: <Info size={18} />, label: 'Version', value: 'v1.0 MVP' },
    ];

    return (
        <div className="settings-section-card">
            <div className="settings-section-header">
                <div className="settings-section-icon">
                    <Database size={20} />
                </div>
                <div className="settings-section-title-block">
                    <h3>System Information</h3>
                    <p>Read-only runtime and environment details</p>
                </div>
            </div>
            <div className="settings-info-grid">
                {infoCards.map((card, i) => (
                    <div key={i} className="settings-info-card">
                        <div className="settings-info-card-icon">{card.icon}</div>
                        <label>{card.label}</label>
                        <span>{card.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ============================================================
   TAB CONFIGURATION
   ============================================================ */
const TABS = [
    { key: 'general', label: 'General', icon: <Globe size={16} />, group: 'general' },
    { key: 'booking', label: 'Booking', icon: <CalendarCheck size={16} />, group: 'booking' },
    { key: 'payments', label: 'Payments', icon: <CreditCard size={16} />, group: 'payments' },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={16} />, group: 'notifications' },
    { key: 'security', label: 'Security', icon: <ShieldCheck size={16} />, group: 'security' },
    { key: 'system', label: 'System Info', icon: <Database size={16} />, group: null },
];

const GROUP_META = {
    general: { title: 'General Settings', desc: 'Core platform identity and contact information', icon: <Globe size={20} /> },
    booking: { title: 'Booking Configuration', desc: 'Control booking rules and constraints', icon: <CalendarCheck size={20} /> },
    payments: { title: 'Payment Gateway', desc: 'Configure payment providers and fees', icon: <CreditCard size={20} /> },
    notifications: { title: 'Notification Settings', desc: 'Manage platform alert channels', icon: <Bell size={20} /> },
    security: { title: 'Security & Access', desc: 'Authentication, session, and security controls', icon: <ShieldCheck size={20} /> },
};

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */
const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [grouped, setGrouped] = useState({});
    const [localValues, setLocalValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }
    const [isDirty, setIsDirty] = useState(false);

    /* ---- fetch all settings ---- */
    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await settingsService.getAllSettings();
            setGrouped(data);
            // Build flat localValues map with parsed values
            const flat = {};
            for (const group of Object.values(data)) {
                for (const s of group) {
                    flat[s.key] = parseValue(s.value, s.value_type);
                }
            }
            setLocalValues(flat);
            setIsDirty(false);
        } catch (err) {
            showToast('error', 'Failed to load settings. Please check the backend connection.');
            console.error('[Settings] fetchSettings:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    /* ---- auto-hide toast ---- */
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    const showToast = (type, message) => setToast({ type, message });

    /* ---- field change handler ---- */
    const handleChange = (key, value, type) => {
        setLocalValues(prev => ({ ...prev, [key]: parseValue(String(value), type) }));
        setIsDirty(true);
    };

    /* ---- save current tab's settings ---- */
    const handleSave = async () => {
        const currentGroup = TABS.find(t => t.key === activeTab)?.group;
        if (!currentGroup) return;

        setSaving(true);
        try {
            const fields = grouped[currentGroup] || [];
            const updates = {};
            for (const field of fields) {
                updates[field.key] = stringifyValue(localValues[field.key], field.value_type);
            }
            await settingsService.bulkUpdate(updates);
            showToast('success', `${GROUP_META[currentGroup]?.title ?? 'Settings'} saved successfully!`);
            await fetchSettings();
        } catch (err) {
            showToast('error', 'Failed to save settings. Please try again.');
            console.error('[Settings] save error:', err);
        } finally {
            setSaving(false);
        }
    };

    /* ---- save ALL settings at once ---- */
    const handleSaveAll = async () => {
        setSaving(true);
        try {
            const allUpdates = {};
            for (const [group, fields] of Object.entries(grouped)) {
                for (const field of fields) {
                    allUpdates[field.key] = stringifyValue(localValues[field.key], field.value_type);
                }
            }
            await settingsService.bulkUpdate(allUpdates);
            showToast('success', 'All settings saved successfully!');
            await fetchSettings();
        } catch (err) {
            showToast('error', 'Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    /* ---- reset to defaults ---- */
    const handleReset = async () => {
        if (!window.confirm('Reset ALL settings to factory defaults? This cannot be undone.')) return;
        setSaving(true);
        try {
            await settingsService.resetToDefaults();
            showToast('success', 'All settings have been reset to defaults.');
            await fetchSettings();
        } catch (err) {
            showToast('error', 'Failed to reset settings.');
        } finally {
            setSaving(false);
        }
    };

    /* ---- render current tab content ---- */
    const renderTabContent = () => {
        const tab = TABS.find(t => t.key === activeTab);

        if (activeTab === 'system') {
            return <SystemInfoPanel />;
        }

        if (loading) {
            return (
                <div className="settings-section-card">
                    <div className="settings-skeleton">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="settings-skeleton-row" style={{ opacity: 1 - i * 0.15 }} />
                        ))}
                    </div>
                </div>
            );
        }

        const group = tab?.group;
        const fields = grouped[group] || [];
        const meta = GROUP_META[group];

        if (!fields.length) {
            return (
                <div className="settings-section-card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-secondary-text)' }}>
                    <Info size={32} style={{ marginBottom: 8 }} />
                    <p>No settings found for this category.</p>
                </div>
            );
        }

        return (
            <SettingsSection
                title={meta?.title}
                description={meta?.desc}
                icon={meta?.icon}
                fields={fields}
                localValues={localValues}
                onChange={handleChange}
                saving={saving}
            />
        );
    };

    /* ---- count unsaved fields in each group ---- */
    const currentGroup = TABS.find(t => t.key === activeTab)?.group;
    const currentFields = currentGroup ? (grouped[currentGroup] || []) : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="settings-container"
        >
            {/* ---- Page Header ---- */}
            <PageHeader
                icon={<Settings size={22} />}
                title="Platform Settings"
                subtitle="Configure Somstay's operational parameters, payment gateways, and security policies"
                stats={[
                    { value: Object.values(grouped).flat().length || '—', label: 'Total Settings' },
                    { value: Object.keys(grouped).length || '—', label: 'Categories' },
                    { value: isDirty ? 'Unsaved' : 'Saved', label: 'Status' },
                ]}
                actions={[
                    <button key="saveall" className="phb-action-btn" onClick={handleSaveAll} disabled={saving || !isDirty}>
                        <Save size={17} />
                        <span>Save All</span>
                    </button>
                ]}
            />

            {/* ---- Toast ---- */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        key="toast"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`settings-toast ${toast.type}`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- Tab Bar ---- */}
            <div className="settings-tab-bar">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`settings-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                        id={`settings-tab-${tab.key}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ---- Tab Content (animated) ---- */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderTabContent()}
                </motion.div>
            </AnimatePresence>

            {/* ---- Action Footer ---- */}
            {activeTab !== 'system' && !loading && (
                <div className="settings-action-footer">
                    <div className="settings-footer-left">
                        <AlertTriangle size={16} />
                        <span>
                            {isDirty
                                ? 'You have unsaved changes. Save to apply them.'
                                : 'All changes are saved to the database.'}
                        </span>
                    </div>
                    <div className="settings-footer-actions">
                        <button className="settings-btn danger" onClick={handleReset} disabled={saving}>
                            <RotateCcw size={15} />
                            Reset Defaults
                        </button>
                        <button className="settings-btn secondary" onClick={fetchSettings} disabled={saving}>
                            <RotateCcw size={15} />
                            Discard
                        </button>
                        <button
                            className="settings-btn primary"
                            onClick={handleSave}
                            disabled={saving || !isDirty || activeTab === 'system'}
                            id="settings-save-btn"
                        >
                            <Save size={15} />
                            {saving ? 'Saving…' : `Save ${GROUP_META[currentGroup]?.title?.split(' ')[0] ?? ''}`}
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default SettingsPage;
