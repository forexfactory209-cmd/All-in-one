import React from 'react';
import './PaymentsTable.css';

const PaymentsTable = ({ payments, loading, onRowClick }) => {
    if (loading) {
        return (
            <div className="payments-loading">
                <div className="spinner"></div>
                <span>Securing transaction data...</span>
            </div>
        );
    }

    return (
        <div className="table-wrapper-industrial">
            <table className="payments-table-main">
                <thead>
                    <tr>
                        <th>TRANSACTION ID</th>
                        <th>GUEST</th>
                        <th>PAYMENT METHOD</th>
                        <th>DATE & TIME</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((p) => (
                            <tr key={p.id} onClick={() => onRowClick && onRowClick(p)} className="clickable-row">
                                <td className="txn-id">{p.id}</td>
                                <td>
                                    <div className="guest-info-cell">
                                        <div className="avatar-letter">{p.guest.charAt(0)}</div>
                                        <span className="guest-name-bold">{p.guest}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="method-cell">
                                        <span className="method-name">{p.method.name}</span>
                                        <span className="method-type">{p.method.type}</span>
                                    </div>
                                </td>
                                <td className="date-cell">{p.date}</td>
                                <td className="amount-cell-bold">{p.amount}</td>
                                <td>
                                    <span className={`txn-status-pill ${p.status.toLowerCase()}`}>
                                        {p.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="empty-table-cell">
                                <div className="empty-state-content">
                                    <p>No transactions found matching your criteria</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentsTable;
