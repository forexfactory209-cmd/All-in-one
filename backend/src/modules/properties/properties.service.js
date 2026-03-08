const propertiesRepository = require('./properties.repository');
const cache = require('../../utils/cache');

class PropertiesService {
    async getAllProperties(page = 1, limit = 10, filters = {}) {
        const cacheKey = `properties:list:p${page}:l${limit}:f${JSON.stringify(filters)}`;
        const cachedData = await cache.get(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;
        const properties = await propertiesRepository.findAll(limit, offset, filters);
        const total = await propertiesRepository.countAll(filters);

        // Enrich each property with its amenities and images
        const enrichedProperties = await Promise.all(properties.map(async (property) => {
            property.amenities = await propertiesRepository.findAmenitiesByPropertyId(property.id);
            property.images = await propertiesRepository.findImagesByPropertyId(property.id);
            return property;
        }));

        const result = {
            properties: enrichedProperties,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };

        await cache.set(cacheKey, result, 300);
        return result;
    }

    async getPropertyById(id) {
        const cacheKey = `properties:detail:${id}`;
        const cachedData = await cache.get(cacheKey);
        if (cachedData) return cachedData;

        const property = await propertiesRepository.findById(id);
        if (property) {
            await cache.set(cacheKey, property, 300);
        }
        return property;
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
        // Invalidate list cache
        await cache.delByPattern('properties:list:*');
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

        if (updated) {
            await cache.del(`properties:detail:${id}`);
            await cache.delByPattern('properties:list:*');
        }
        return updated;
    }

    async deleteProperty(id) {
        const success = await propertiesRepository.delete(id);
        if (success) {
            await cache.del(`properties:detail:${id}`);
            await cache.delByPattern('properties:list:*');
        }
        return success;
    }
}

module.exports = new PropertiesService();
