import api from '../../../services/api';

class DisputeService {
    async getDisputes() {
        try {
            const response = await api.get('/v1/disputes');
            return response.data.map(d => ({
                id: `DSP-${String(d.id).padStart(4, '0')}`,
                dbId: d.id,
                bookingId: d.booking_id_ref || `BK-${d.booking_id}`,
                guest: d.guest_name || 'System User',
                subject: d.subject,
                message: d.description,
                timestamp: new Date(d.created_at).toLocaleString(),
                status: d.status,
                priority: d.priority,
                admin_response: d.admin_response
            }));
        } catch (error) {
            console.error("Error fetching disputes:", error);
            throw error;
        }
    }

    async updateDisputeStatus(id, status, admin_response = null) {
        try {
            // If id is passing as DSP-0001, we need to extract the numeric part if needed, 
            // but usually we pass the dbId. Let's assume we pass the dbId or search it.
            const response = await api.patch(`/v1/disputes/${id}/status`, {
                status,
                admin_response
            });
            return response.success;
        } catch (error) {
            console.error(`Error updating dispute ${id}:`, error);
            throw error;
        }
    }

    async createDispute(disputeData) {
        try {
            const response = await api.post('/v1/disputes', disputeData);
            return response.success;
        } catch (error) {
            console.error("Error creating dispute:", error);
            throw error;
        }
    }
}

export const disputeService = new DisputeService();
