const disputesService = require('./disputes.service');
const { sendResponse, sendError } = require('../../utils/response');

class DisputesController {
    async getAllDisputes(req, res) {
        try {
            const disputes = await disputesService.getAllDisputes();
            return sendResponse(res, 200, true, 'Disputes retrieved successfully', disputes);
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }

    async getDisputeById(req, res) {
        try {
            const dispute = await disputesService.getDisputeById(req.params.id);
            if (!dispute) return sendError(res, 404, 'Dispute not found');
            return sendResponse(res, 200, true, 'Dispute retrieved successfully', dispute);
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }

    async createDispute(req, res) {
        try {
            const disputeId = await disputesService.createDispute(req.body);
            return sendResponse(res, 201, true, 'Dispute filed successfully', { id: disputeId });
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }

    async updateStatus(req, res) {
        try {
            const updated = await disputesService.updateDisputeStatus(req.params.id, req.body);
            if (!updated) return sendError(res, 400, 'Failed to update dispute status');
            return sendResponse(res, 200, true, 'Dispute status updated successfully');
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }
}

module.exports = new DisputesController();
