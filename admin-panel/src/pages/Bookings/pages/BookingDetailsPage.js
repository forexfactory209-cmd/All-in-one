import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Printer,
    FileText,
    Calendar,
    User,
    Info,
    CheckCircle,
    Clock,
    MapPin,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { bookingService } from '../services/bookingService';
import PageHeader from '../../../components/PageHeader';
import './BookingDetailsPage.css';

const BookingDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            setLoading(true);
            try {
                const data = await bookingService.getBookingById(id);
                if (data) {
                    setBooking({
                        id: `#BK-${String(data.id).padStart(4, '0')}`,
                        dbId: data.id,
                        generatedDate: new Date(data.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                        staff: 'Administrator',
                        paymentStatus: `${data.payment_status.toUpperCase()} (Manual)`,
                        bookingStatus: data.status.toUpperCase(),
                        guest: {
                            name: data.guest_name,
                            phone: data.guest_phone || 'Not provided',
                            email: data.guest_email || 'Not provided'
                        },
                        stay: {
                            property: data.entity_name || 'Reserved Asset',
                            unit: data.unit_type || data.entity_type,
                            room_number: data.unit_number || 'N/A',
                            checkIn: new Date(data.check_in).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                            checkOut: new Date(data.check_out).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                            total: data.total_price
                        },
                        instructions: {
                            status: data.status === 'Confirmed' ? 'Ready for Guest' : 'Awaiting Processing',
                            specialRequests: [
                                'Auto-generated operational sheet',
                                `System referenced ID: SH-DOC-${data.id}`
                            ],
                            cleaning: {
                                lastCleaning: 'System Regular',
                                assignedTo: 'Platform Operations'
                            }
                        },
                        systemReference: `SOM-OP-${data.id}-${new Date(data.created_at).getFullYear()}`
                    });
                }
            } catch (error) {
                console.error('Failed to load booking details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBookingDetails();
    }, [id]);

    const handleDownloadPDF = async () => {
        const element = document.querySelector('.reservation-document-card');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Booking_${booking.id}_Sheet.pdf`);
        } catch (error) {
            console.error("PDF download failed:", error);
        }
    };

    if (loading || !booking) return (
        <div className="loading-container">
            <div className="industrial-spinner"></div>
            <span>Loading Reservation Sheet...</span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="booking-details-wrapper"
        >
            <PageHeader
                backAction={() => navigate(-1)}
                icon={<Calendar size={22} />}
                title={`Booking ${booking.id}`}
                subtitle={`Generated on ${booking.generatedDate}`}
                stats={[
                    { value: booking.paymentStatus.split(' ')[0], label: 'Payment' },
                    { value: String(booking.stay.total), label: 'Total ($)' }
                ]}
                actions={[
                    <button key="print" className="phb-action-btn secondary" onClick={() => window.print()}>
                        <Printer size={16} />
                        <span>Print</span>
                    </button>,
                    <button key="pdf" className="phb-action-btn" onClick={handleDownloadPDF}>
                        <FileText size={16} />
                        <span>Download PDF</span>
                    </button>
                ]}
            />

            {/* Document Header (Inside Card) */}
            <div className="reservation-document-card">
                {/* Branding row */}
                <div className="doc-branding">
                    <div className="brand-logotype">
                        <div className="brand-symbol">
                            <CheckCircle size={24} />
                        </div>
                        <div className="brand-text-block">
                            <span className="brand-name">SOM STAY</span>
                            <span className="brand-desc">Operational Document System</span>
                        </div>
                    </div>
                </div>

                <div className="doc-main-header">
                    <div className="header-left-meta">
                        <span className="sheet-badge">RESERVATION SHEET</span>
                        <h1 className="booking-id-title">Booking ID: {booking.id}</h1>
                        <div className="meta-info-row">
                            <div className="meta-item">
                                <Calendar size={14} />
                                <span>Generated: {booking.generatedDate}</span>
                            </div>
                            <div className="meta-item">
                                <User size={14} />
                                <span>Staff: {booking.staff}</span>
                            </div>
                        </div>
                    </div>
                    <div className="header-status-pills">
                        <div className="status-pill-pair payment">
                            <span className="label">PAYMENT STATUS</span>
                            <span className="value">{booking.paymentStatus}</span>
                        </div>
                        <div className="status-pill-pair booking">
                            <span className="label">BOOKING STATUS</span>
                            <span className="value">{booking.bookingStatus}</span>
                        </div>
                    </div>
                </div>

                <div className="doc-info-grid">
                    {/* Guest Section */}
                    <div className="info-column">
                        <div className="column-header">
                            <User size={18} className="icon-blue" />
                            <h3>Guest Information</h3>
                        </div>
                        <div className="info-fields">
                            <div className="field-group">
                                <label>FULL NAME</label>
                                <p>{booking.guest.name}</p>
                            </div>
                            <div className="field-group">
                                <label>PHONE NUMBER</label>
                                <p>{booking.guest.phone}</p>
                            </div>
                            <div className="field-group">
                                <label>EMAIL ADDRESS</label>
                                <p>{booking.guest.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stay Section */}
                    <div className="info-column">
                        <div className="column-header">
                            <MapPin size={18} className="icon-blue" />
                            <h3>Stay Information</h3>
                        </div>
                        <div className="info-fields">
                            <div className="field-group">
                                <label>PROPERTY / ASSET</label>
                                <p>{booking.stay.property}</p>
                            </div>
                            <div className="stay-sub-grid">
                                <div className="field-group">
                                    <label>UNIT TYPE</label>
                                    <p>{booking.stay.unit}</p>
                                </div>
                                <div className="field-group">
                                    <label>ROOM #</label>
                                    <p>{booking.stay.room_number}</p>
                                </div>
                            </div>
                            <div className="stay-sub-grid">
                                <div className="field-group">
                                    <label>CHECK-IN</label>
                                    <p>{booking.stay.checkIn}</p>
                                </div>
                                <div className="field-group">
                                    <label>CHECK-OUT</label>
                                    <p>{booking.stay.checkOut}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations Instructions Block */}
                <div className="ops-instructions-block">
                    <div className="ops-header">
                        <div className="ops-title-group">
                            <Info size={16} />
                            <span>OPERATIONAL INSTRUCTIONS</span>
                        </div>
                        <div className="ops-status-badge">
                            <span className="dot"></span>
                            <span>{booking.instructions.status}</span>
                        </div>
                    </div>
                    <div className="ops-body-grid">
                        <div className="ops-requests-col">
                            <label className="ops-label">SYSTEM LOGS & REQUESTS</label>
                            <div className="request-items">
                                {booking.instructions.specialRequests.map((req, i) => (
                                    <div key={i} className="request-item">
                                        {i === 0 ? <Clock size={14} className="icon-red" /> : <CheckCircle size={14} className="icon-teal" />}
                                        <span>{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="ops-cleaning-col">
                            <label className="ops-label">FINANCIAL OVERVIEW</label>
                            <div className="cleaning-data-card">
                                <div className="clean-row">
                                    <span className="clean-label">Total Contract Amount:</span>
                                    <span className="clean-val">${booking.stay.total}</span>
                                </div>
                                <div className="clean-row">
                                    <span className="clean-label">Currency:</span>
                                    <span className="clean-val">USD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signature Rows */}
                <div className="signature-area">
                    <div className="signature-box">
                        <div className="sig-line"></div>
                        <span>RECEPTIONIST SIGNATURE</span>
                    </div>
                    <div className="signature-box">
                        <div className="sig-line"></div>
                        <span>MANAGEMENT APPROVAL</span>
                    </div>
                </div>

                <div className="doc-footer-legal">
                    <p>This is an internal operational document. Modification without authorization is prohibited.</p>
                    <p className="sys-ref">System Reference: {booking.systemReference}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default BookingDetailsPage;
