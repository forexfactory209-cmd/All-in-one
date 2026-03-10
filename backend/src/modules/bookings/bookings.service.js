const bookingsRepository = require('./bookings.repository');
const paymentsService = require('../payments/payments.service');
const queueService = require('../../shared/queue.service');

class BookingsService {
    async getAllBookings(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const bookings = await bookingsRepository.findAll(limit, offset);
        const total = await bookingsRepository.countAll();

        return {
            bookings,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async createBooking(bookingData) {
        const bookingId = await bookingsRepository.create(bookingData);

        // --- BACKGROUND JOBS ---
        // 1. Offload payment sync and notifications to BullMQ
        queueService.addBookingJob('SEND_CONFIRMATION', {
            bookingId,
            userId: bookingData.user_id,
            totalPrice: bookingData.total_price
            // In a real app, you'd fetch user email/phone here or pass it in
        });

        queueService.addBookingJob('NOTIFY_ADMIN', {
            bookingId,
            entityType: bookingData.entity_type,
            entityId: bookingData.entity_id
        });

        // If it's a room booking, update hotel analytics in background
        if (bookingData.entity_type === 'Room') {
            queueService.addBookingJob('PROCESS_ANALYTICS', {
                bookingId,
                entityId: bookingData.entity_id
            });
        }

        // Keep the sync payment for now as it's critical path, 
        // but we could also move it to worker if the user prefers ultimate speed.
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
