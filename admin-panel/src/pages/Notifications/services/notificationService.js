/**
 * Notification Service
 * Handles all notification-related data operations for the admin panel.
 */

class NotificationService {
    async getNotifications() {
        // Mock data for industrial notification stream
        return [
            {
                id: 'NT-5501',
                type: 'BOOKING_REQUEST',
                title: 'New Booking Request',
                message: 'Ahmed Ali requested to book "Hargeisa Luxury Villa" for 3 nights.',
                time: '2 mins ago',
                status: 'UNREAD',
                priority: 'HIGH',
                link: '/bookings/BK-99201'
            },
            {
                id: 'NT-5502',
                type: 'PAYMENT_SUCCESS',
                title: 'Payment Confirmed',
                message: 'Transaction TXN-9821 ($450.00) was successfully processed via ZAAD.',
                time: '15 mins ago',
                status: 'READ',
                priority: 'MEDIUM',
                link: '/payments'
            },
            {
                id: 'NT-5503',
                type: 'PROPERTY_VERIFICATION',
                title: 'Property Verification Needed',
                message: 'Mustafa Omar submitted a new property "Borao Heights" for verification.',
                time: '1 hour ago',
                status: 'UNREAD',
                priority: 'HIGH',
                link: '/properties'
            },
            {
                id: 'NT-5504',
                type: 'NEW_REVIEW',
                title: 'New Guest Review',
                message: 'Sahra Duale posted a 5-star review for "Sea View Apartment".',
                time: '3 hours ago',
                status: 'READ',
                priority: 'LOW',
                link: '/reviews'
            },
            {
                id: 'NT-5505',
                type: 'DISPUTE_OPENED',
                title: 'Dispute Case Opened',
                message: 'Guest ID-8824 has opened a dispute regarding booking BK-87729.',
                time: '5 hours ago',
                status: 'UNREAD',
                priority: 'HIGH',
                link: '/reports'
            }
        ];
    }

    async markAsRead(id) {
        console.log(`Notification ${id} marked as read.`);
        return true;
    }

    async deleteNotification(id) {
        console.log(`Notification ${id} deleted.`);
        return true;
    }
}

export const notificationService = new NotificationService();
