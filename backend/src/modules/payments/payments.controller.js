const paymentsService = require('./payments.service');
const { sendResponse, sendError } = require('../../utils/response');

class PaymentsController {
    async getAll(req, res) {
        try {
            const payments = await paymentsService.getAllPayments();
            return sendResponse(res, 200, true, 'Payments retrieved successfully', payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getDetails(req, res) {
        try {
            const { id } = req.params;
            const payment = await paymentsService.getPaymentDetails(id);
            if (!payment) {
                return sendError(res, 404, 'Payment record not found');
            }
            return sendResponse(res, 200, true, 'Payment details retrieved', payment);
        } catch (error) {
            console.error('Error fetching payment details:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async verify(req, res) {
        try {
            const { id } = req.params;
            const { status, verified_by } = req.body;

            const updated = await paymentsService.updatePaymentStatus(id, status, verified_by);
            if (!updated) {
                return sendError(res, 404, 'Payment record not found');
            }

            return sendResponse(res, 200, true, 'Payment status updated successfully');
        } catch (error) {
            console.error('Error verifying payment:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }
}

module.exports = new PaymentsController();
