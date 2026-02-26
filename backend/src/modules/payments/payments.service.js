const paymentsRepository = require('./payments.repository');

class PaymentsService {
    async getAllPayments() {
        return await paymentsRepository.findAll();
    }

    async getPaymentDetails(id) {
        return await paymentsRepository.findById(id);
    }

    async createPayment(paymentData) {
        return await paymentsRepository.create(paymentData);
    }

    async updatePaymentStatus(id, status, verifiedBy) {
        return await paymentsRepository.updateStatus(id, status, verifiedBy);
    }

    async getPaymentByBookingId(bookingId) {
        return await paymentsRepository.findByBookingId(bookingId);
    }

    async syncPaymentByBookingId(bookingId, paymentData) {
        const existing = await paymentsRepository.findByBookingId(bookingId);
        if (existing) {
            return await paymentsRepository.updateByBookingId(bookingId, paymentData);
        } else if (paymentData.status === 'Success') {
            // Only create if it's successful (Paid)
            return await paymentsRepository.create({
                booking_id: bookingId,
                transaction_id: `AUTO-${Date.now()}-${bookingId}`,
                ...paymentData
            });
        }
        return false;
    }
}

module.exports = new PaymentsService();
