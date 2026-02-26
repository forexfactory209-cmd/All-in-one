import api from '../../../services/api';

/**
 * Payment Service - Pure API Bridge
 * Manages transactions and payout records.
 */
export const paymentService = {
    // Fetch transaction history
    getTransactions: async () => {
        const response = await api.get('/v1/payments'); // Updated to match new REST route
        return response.data;
    },

    // Fetch single payment details
    getPaymentById: async (id) => {
        const response = await api.get(`/v1/payments/${id}`);
        return response.data;
    },

    // Verify a payment status manually if needed
    verifyPayment: async (paymentId, status, verifiedBy) => {
        return await api.post(`/v1/payments/verify/${paymentId}`, { status, verified_by: verifiedBy });
    }
};
