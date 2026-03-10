const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

/**
 * Check connectivity to Elasticsearch
 */
const checkConnection = async () => {
    try {
        await client.ping();
        console.log('✅ Connected to Elasticsearch');
        return true;
    } catch (error) {
        console.error('❌ Elasticsearch connection failed:', error.message);
        return false;
    }
};

/**
 * Initialize Elasticsearch index with mapping
 */
const initIndex = async () => {
    const indexName = 'hotels';
    
    try {
        const exists = await client.indices.exists({ index: indexName });
        
        if (exists) {
            console.log(`Index "${indexName}" already exists.`);
            return;
        }

        await client.indices.create({
            index: indexName,
            mappings: {
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'text', analyzer: 'standard' },
                    description: { type: 'text', analyzer: 'standard' },
                    type: { type: 'keyword' },
                    location: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                    address: { type: 'text' },
                    coordinates: { type: 'geo_point' }, // For distance search
                    base_price: { type: 'float' },
                    rating: { type: 'float' },
                    status: { type: 'keyword' },
                    amenities: { type: 'keyword' }, // Array of strings
                    main_image: { type: 'keyword', index: false },
                    created_at: { type: 'date' }
                }
            }
        });
        
        console.log(`✅ Index "${indexName}" created with mappings.`);
    } catch (error) {
        console.error('❌ Error creating Elasticsearch index:', error);
    }
};

module.exports = {
    client,
    checkConnection,
    initIndex
};
