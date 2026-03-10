const { client } = require('../../utils/elasticsearch');

class HotelsSearchService {
    constructor() {
        this.indexName = 'hotels';
    }

    /**
     * Index a single hotel document
     */
    async indexHotel(hotel) {
        try {
            const document = {
                id: hotel.id,
                name: hotel.name,
                description: hotel.description,
                type: hotel.type,
                location: hotel.location,
                address: hotel.address,
                coordinates: {
                    lat: parseFloat(hotel.latitude) || 0,
                    lon: parseFloat(hotel.longitude) || 0
                },
                base_price: parseFloat(hotel.base_price) || 0,
                rating: parseFloat(hotel.rating) || 0,
                review_count: parseInt(hotel.review_count) || 0,
                status: hotel.status,
                amenities: hotel.amenities ? hotel.amenities.map(a => typeof a === 'string' ? a : a.name) : [],
                main_image: hotel.main_image,
                created_at: hotel.created_at || new Date().toISOString()
            };

            await client.index({
                index: this.indexName,
                id: hotel.id.toString(),
                document: document,
                refresh: true // Ensure it's searchable immediately after update
            });
            
            console.log(`🔍 Indexed hotel in ES: ${hotel.name} (ID: ${hotel.id})`);
        } catch (error) {
            console.error(`❌ Failed to index hotel ${hotel.id} in ES:`, error.message);
        }
    }

    /**
     * Remove a hotel from the index
     */
    async deleteHotel(hotelId) {
        try {
            await client.delete({
                index: this.indexName,
                id: hotelId.toString(),
                refresh: true
            });
            console.log(`🔍 Deleted hotel from ES (ID: ${hotelId})`);
        } catch (error) {
            if (error.meta && error.meta.statusCode === 404) {
                console.warn(`⚠️ Hotel ${hotelId} not found in ES for deletion.`);
            } else {
                console.error(`❌ Failed to delete hotel ${hotelId} from ES:`, error.message);
            }
        }
    }

    /**
     * Perform complex search in Elasticsearch
     */
    async search(filters) {
        const {
            q, // search query
            city,
            minPrice,
            maxPrice,
            amenities,
            minRating,
            lat,
            lon,
            distance = '10km',
            sort = 'relevance',
            page = 1,
            limit = 10
        } = filters;

        const must = [];
        const filter = [{ term: { status: 'Active' } }];

        // Text search (name and description)
        if (q) {
            must.push({
                multi_match: {
                    query: q,
                    fields: ['name^3', 'description', 'location^2'],
                    fuzziness: 'AUTO'
                }
            });
        }

        // City filter
        if (city && city !== 'All') {
            filter.push({ 
                match: { 
                    location: city 
                } 
            });
        }

        // Price range
        if (minPrice !== undefined || maxPrice !== undefined) {
            const range = {};
            if (minPrice !== undefined) range.gte = parseFloat(minPrice);
            if (maxPrice !== undefined) range.lte = parseFloat(maxPrice);
            filter.push({ range: { base_price: range } });
        }

        // Rating
        if (minRating !== undefined) {
            filter.push({ range: { rating: { gte: parseFloat(minRating) } } });
        }

        // Amenities (must have all selected amenities)
        if (amenities && Array.isArray(amenities) && amenities.length > 0) {
            amenities.forEach(amenity => {
                filter.push({ term: { amenities: amenity } });
            });
        }

        // Geo-distance search
        if (lat && lon) {
            filter.push({
                geo_distance: {
                    distance: distance,
                    coordinates: {
                        lat: parseFloat(lat),
                        lon: parseFloat(lon)
                    }
                }
            });
        }

        // Sort configuration
        let sortConfig = ['_score'];
        if (sort === 'price_low') sortConfig = [{ base_price: 'asc' }];
        else if (sort === 'price_high') sortConfig = [{ base_price: 'desc' }];
        else if (sort === 'rating') sortConfig = [{ rating: 'desc' }];
        else if (lat && lon && sort === 'distance') {
            sortConfig = [{
                _geo_distance: {
                    coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
                    order: 'asc',
                    unit: 'km',
                    mode: 'min',
                    distance_type: 'arc',
                    ignore_unmapped: true
                }
            }];
        }

        try {
            const result = await client.search({
                index: this.indexName,
                from: (page - 1) * limit,
                size: limit,
                query: {
                    bool: {
                        must: must.length > 0 ? must : { match_all: {} },
                        filter: filter
                    }
                },
                sort: sortConfig
            });

            const hits = result.hits.hits;
            const total = typeof result.hits.total === 'object' ? result.hits.total.value : result.hits.total;

            return {
                hotels: hits.map(hit => ({
                    ...hit._source,
                    _score: hit._score,
                    distance: hit.sort && lat && lon && sort === 'distance' ? hit.sort[0] : null
                })),
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('❌ Elasticsearch search failed:', error.message);
            throw error;
        }
    }
}

module.exports = new HotelsSearchService();
