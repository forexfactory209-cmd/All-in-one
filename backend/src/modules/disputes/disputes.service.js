const disputesRepository = require('./disputes.repository');

class DisputesService {
    async getAllDisputes() {
        return await disputesRepository.findAll();
    }

    async getDisputeById(id) {
        return await disputesRepository.findById(id);
    }

    async createDispute(disputeData) {
        return await disputesRepository.create(disputeData);
    }

    async updateDisputeStatus(id, updateData) {
        const { status, admin_response, resolved_by } = updateData;
        return await disputesRepository.updateStatus(id, status, admin_response, resolved_by);
    }
}

module.exports = new DisputesService();
