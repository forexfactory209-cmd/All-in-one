const propertiesService = require('./properties.service');
const { sendResponse, sendError } = require('../../utils/response');

class PropertiesController {
    async getAllProperties(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await propertiesService.getAllProperties(parseInt(page), parseInt(limit), filters);
            return sendResponse(res, 200, true, 'Properties retrieved successfully', result.properties, null, result.pagination);
        } catch (error) {
            console.error('Error fetching properties:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getPropertyById(req, res) {
        try {
            const { id } = req.params;
            const property = await propertiesService.getPropertyById(id);
            if (!property) {
                return sendError(res, 404, 'Property not found');
            }
            return sendResponse(res, 200, true, 'Property retrieved successfully', property);
        } catch (error) {
            console.error('Error fetching property:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async createProperty(req, res) {
        try {
            const propertyId = await propertiesService.createProperty(req.body);
            return sendResponse(res, 201, true, 'Property created successfully', { id: propertyId });
        } catch (error) {
            console.error('Error creating property:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async updateProperty(req, res) {
        try {
            const { id } = req.params;
            const success = await propertiesService.updateProperty(id, req.body);
            if (!success) {
                return sendError(res, 404, 'Property not found or no changes made');
            }
            return sendResponse(res, 200, true, 'Property updated successfully');
        } catch (error) {
            console.error('Error updating property:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async deleteProperty(req, res) {
        try {
            const { id } = req.params;
            const success = await propertiesService.deleteProperty(id);
            if (!success) {
                return sendError(res, 404, 'Property not found');
            }
            return sendResponse(res, 200, true, 'Property deleted successfully');
        } catch (error) {
            console.error('Error deleting property:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }
}

module.exports = new PropertiesController();
