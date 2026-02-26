import jsPDF from 'jspdf';

/**
 * Generates a professional PDF for a booking
 */
export const generateBookingPDF = (bookingData) => {
    const doc = new jsPDF();
    const primaryColor = '#0288AC';
    const darkColor = '#04252E';

    // Header
    doc.setFillColor(darkColor);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor('#FFFFFF');
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('SOM STAY', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL RESERVATION DOCUMENT', 20, 32);

    // Reserved For Section
    doc.setTextColor(darkColor);
    doc.setFontSize(10);
    doc.text('RESERVATION FOR:', 20, 55);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.guest?.name || 'Valued Guest', 20, 65);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Phone: ${bookingData.guest?.phone || 'N/A'}`, 20, 72);

    // Booking Details Table
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 85, 190, 85);

    const details = [
        ['Booking Reference:', bookingData.id],
        ['Property / Room:', bookingData.property],
        ['City / Location:', bookingData.city],
        ['Dates:', bookingData.dates],
        ['Booking Status:', bookingData.status],
        ['Payment Status:', bookingData.payment?.status]
    ];

    let y = 100;
    details.forEach(detail => {
        doc.setFont('helvetica', 'bold');
        doc.text(detail[0], 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(detail[1]), 80, y);
        y += 10;
    });

    // Price Section
    doc.setFillColor('#F3F4F6');
    doc.rect(130, 160, 60, 30, 'F');

    doc.setTextColor(darkColor);
    doc.setFontSize(10);
    doc.text('TOTAL AMOUNT', 135, 170);

    doc.setTextColor(primaryColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${bookingData.total_price || '0.00'}`, 135, 182);

    // Footer
    doc.setTextColor('#94A3B8');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a system-generated reservation confirmation.', 20, 275);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);

    doc.save(`SomStay_Booking_${bookingData.id}.pdf`);
};
