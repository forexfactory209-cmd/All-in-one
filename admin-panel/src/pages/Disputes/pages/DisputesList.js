import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, Plus, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { disputeService } from '../services/disputeService';
import DisputesTable from '../sections/DisputesTable';
import DisputeDetailsPopup from '../popups/DisputeDetailsPopup';
import AddDisputePopup from '../popups/AddDisputePopup';
import PageHeader from '../../../components/PageHeader';
import './DisputesPage.css';

const DisputesList = () => {
    const { id: urlId } = useParams();
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);

    useEffect(() => {
        loadDisputes();
    }, []);

    // Effect to open dispute details if ID is in URL from dashboard
    useEffect(() => {
        if (urlId && disputes.length > 0) {
            const disputeToOpen = disputes.find(d => 
                String(d.id).toLowerCase() === String(urlId).toLowerCase() || 
                String(d.dbId) === String(urlId)
            );
            if (disputeToOpen) {
                setSelectedDispute(disputeToOpen);
                setShowDetails(true);
            }
        }
    }, [urlId, disputes]);

    const loadDisputes = async () => {
        setLoading(true);
        try {
            const data = await disputeService.getDisputes();
            setDisputes(data);
        } catch (error) {
            console.error("Failed to load disputes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRowClick = (dispute) => {
        setSelectedDispute(dispute);
        setShowDetails(true);
    };

    const handleUpdateStatus = (id, newStatus) => {
        setDisputes(prev => prev.map(d =>
            (d.id === id || d.dbId === id) ? { ...d, status: newStatus } : d
        ));
        // Also update selectedDispute if it's the one we're looking at
        if (selectedDispute && (selectedDispute.id === id || selectedDispute.dbId === id)) {
            setSelectedDispute(prev => ({ ...prev, status: newStatus }));
        }
    };

    const filteredDisputes = disputes.filter(d =>
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="disputes-page-hub"
        >
            <PageHeader
                icon={<ShieldAlert size={22} />}
                title="Dispute & Resolution Center"
                subtitle="Managing customer grievances and booking conflicts"
                stats={[
                    { value: String(disputes.filter(d => d.status === 'OPEN').length), label: 'Open' },
                    { value: String(disputes.filter(d => d.priority === 'HIGH' && d.status !== 'RESOLVED').length), label: 'Critical' },
                    { value: String(disputes.filter(d => d.status === 'RESOLVED').length), label: 'Resolved' }
                ]}
                actions={[
                    <button key="refresh" className="phb-action-btn secondary" onClick={loadDisputes}>
                        <RefreshCw size={16} />
                        <span>Refresh</span>
                    </button>,
                    <button key="log" className="phb-action-btn" onClick={() => setShowAddPopup(true)}>
                        <Plus size={17} />
                        <span>Log Dispute</span>
                    </button>
                ]}
            />
            <div className="hub-stats-grid">
                <div className="stat-industrial-card error">
                    <span className="stat-label">Critical Cases</span>
                    <span className="stat-value">{disputes.filter(d => d.priority === 'HIGH' && d.status !== 'RESOLVED').length}</span>
                </div>
                <div className="stat-industrial-card warning">
                    <span className="stat-label">Pending Response</span>
                    <span className="stat-value">{disputes.filter(d => d.status === 'OPEN').length}</span>
                </div>
                <div className="stat-industrial-card success">
                    <span className="stat-label">Resolved (Total)</span>
                    <span className="stat-value">{disputes.filter(d => d.status === 'RESOLVED').length}</span>
                </div>
            </div>

            <div className="hub-controls">
                <div className="industrial-search-field">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by Case ID, Booking ID, or Guest name..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="control-group">
                    <button className="filter-chip-btn">
                        <Filter size={16} />
                        <span>All Cases</span>
                    </button>
                    <button className="export-link-btn" onClick={loadDisputes}>
                        <RefreshCw size={16} />
                        <span>Refresh Stream</span>
                    </button>
                </div>
            </div>

            <div className="hub-table-container">
                <DisputesTable
                    disputes={filteredDisputes}
                    loading={loading}
                    onRowClick={handleRowClick}
                />
            </div>

            <DisputeDetailsPopup
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                dispute={selectedDispute}
                onUpdateStatus={handleUpdateStatus}
            />

            <AddDisputePopup
                isOpen={showAddPopup}
                onClose={() => setShowAddPopup(false)}
                onSuccess={loadDisputes}
            />
        </motion.div>
    );
};

export default DisputesList;
