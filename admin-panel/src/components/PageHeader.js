import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './PageHeader.css';

/**
 * Shared premium gradient page header.
 *
 * Props:
 *   icon       – Lucide React icon element
 *   title      – Main heading text
 *   subtitle   – Secondary description text
 *   stats      – Array of { label, value } shown as pills (optional)
 *   actions    – Array of React elements to render as action buttons (optional)
 *   backAction – Function to call when back button is clicked (optional)
 */
const PageHeader = ({ icon, title, subtitle, stats = [], actions = [], backAction }) => {
    return (
        <div className="page-header-banner">
            <div className="phb-left">
                {backAction && (
                    <button className="phb-back-btn" onClick={backAction}>
                        <ChevronLeft size={24} />
                    </button>
                )}
                {icon && <div className="phb-icon">{icon}</div>}
                <div className="phb-text">
                    <h1 className="phb-title">{title}</h1>
                    {subtitle && <p className="phb-subtitle">{subtitle}</p>}
                </div>
            </div>

            <div className="phb-right">
                {stats.length > 0 && (
                    <div className="phb-stats-pill">
                        {stats.map((s, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <div className="phb-stat-divider" />}
                                <div className="phb-stat-item">
                                    <span className="phb-stat-value">{s.value}</span>
                                    <span className="phb-stat-label">{s.label}</span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                )}
                {actions.map((action, i) => (
                    <React.Fragment key={i}>{action}</React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default PageHeader;
