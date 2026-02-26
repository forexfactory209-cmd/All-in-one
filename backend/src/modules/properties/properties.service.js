const propertiesRepository = require('./properties.repository');

class PropertiesService {
    async getAllProperties() {
        const properties = await propertiesRepository.findAll();
        // Enrich each property with its amenities and images
        const enrichedProperties = await Promise.all(properties.map(async (property) => {
            property.amenities = await propertiesRepository.findAmenitiesByPropertyId(property.id);
            property.images = await propertiesRepository.findImagesByPropertyId(property.id);
            return property;
        }));
        return enrichedProperties;
    }

    async getPropertyById(id) {
        return await propertiesRepository.findById(id);
    }

    async createProperty(propertyData) {
        console.log('--- BACKEND SERVICE: createProperty received data:', JSON.stringify(propertyData, null, 2));
        const propertyId = await propertiesRepository.create(propertyData);
        if (propertyData.amenities) {
            await propertiesRepository.syncAmenities(propertyId, propertyData.amenities);
        }
        if (propertyData.images) {
            await propertiesRepository.syncImages(propertyId, propertyData.images);
        }
        return propertyId;
    }

    async updateProperty(id, propertyData) {
        let updated = await propertiesRepository.update(id, propertyData);

        if (propertyData.amenities) {
            await propertiesRepository.syncAmenities(id, propertyData.amenities);
            updated = true;
        }
        if (propertyData.images) {
            await propertiesRepository.syncImages(id, propertyData.images);
            updated = true;
        }

        return updated;
    }

    async deleteProperty(id) {
        return await propertiesRepository.delete(id);
    }
}

module.exports = new PropertiesService();
