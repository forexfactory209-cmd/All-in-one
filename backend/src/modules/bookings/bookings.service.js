const bookingsRepository = require('./bookings.repository');
const paymentsService = require('../payments/payments.service');

class BookingsService {
    async getAllBookings() {
        return await bookingsRepository.findAll();
    }

    async createBooking(bookingData) {
        const bookingId = await bookingsRepository.create(bookingData);

        // If payment status is Paid, ensure a payment record exists
        if (bookingData.payment_status && bookingData.payment_status.toUpperCase() === 'PAID') {
            try {
                await paymentsService.syncPaymentByBookingId(bookingId, {
                    amount: bookingData.total_price,
                    method_name: bookingData.payment_method || 'OTHERS',
                    provider: 'System Auto',
                    method_type: 'Mobile',
                    status: 'Success'
                });
            } catch (error) {
                console.error('Failed to sync payment record on creation:', error);
            }
        }

        return bookingId;
    }

    async getUserBookings(userId) {
        return await bookingsRepository.findByUserId(userId);
    }

    async getBookingById(id) {
        return await bookingsRepository.findById(id);
    }

    async updateBookingStatus(id, status, paymentStatus) {
        // Fetch current booking data
        const booking = await this.getBookingById(id);
        const success = await bookingsRepository.updateStatus(id, status, paymentStatus);

        if (success && paymentStatus) {
            try {
                // Determine if we should create/update a payment
                const isPaid = paymentStatus.toUpperCase() === 'PAID';

                await paymentsService.syncPaymentByBookingId(id, {
                    amount: booking.total_price,
                    method_name: 'MANUAL',
                    provider: 'Admin Update',
                    method_type: 'Mobile',
                    status: isPaid ? 'Success' : 'Pending'
                });
            } catch (error) {
                console.error('Failed to sync payment record on status update:', error);
            }
        }

        return success;
    }

    async updateBooking(id, bookingData) {
        const oldBooking = await this.getBookingById(id);
        const success = await bookingsRepository.update(id, bookingData);

        if (success) {
            try {
                const finalAmount = bookingData.total_price !== undefined ? bookingData.total_price : oldBooking.total_price;
                const finalPaymentStatus = bookingData.payment_status || oldBooking.payment_status;
                const isPaid = finalPaymentStatus.toUpperCase() === 'PAID';

                await paymentsService.syncPaymentByBookingId(id, {
                    amount: finalAmount,
                    method_name: bookingData.payment_method || oldBooking.actual_payment_method || 'OTHERS',
                    provider: 'Admin Manual',
                    method_type: 'Mobile',
                    status: isPaid ? 'Success' : 'Pending'
                });
            } catch (error) {
                console.error('Failed to sync payment record on update:', error);
            }
        }

        return success;
    }

    async deleteBooking(id) {
        return await bookingsRepository.delete(id);
    }
}

module.exports = new BookingsService();
