const pool = require('../../config/database');

class PropertiesRepository {
    async findAll() {
        const [rows] = await pool.execute('SELECT * FROM properties ORDER BY created_at DESC');
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM properties WHERE id = ?', [id]);
        if (!rows[0]) return null;

        const property = rows[0];
        property.images = await this.findImagesByPropertyId(id);
        property.amenities = await this.findAmenitiesByPropertyId(id);
        return property;
    }

    async create(propertyData) {
        const name = propertyData.name;
        const description = propertyData.description || null;
        // Normalize type to valid ENUM values
        const rawType = (propertyData.type || '').toLowerCase();
        let type = 'Home';
        if (rawType.includes('apartment')) type = 'Apartment';
        else if (rawType.includes('villa')) type = 'Villa';
        else if (rawType.includes('cabin')) type = 'Cabin';
        else if (rawType.includes('loft')) type = 'Loft';
        else if (rawType.includes('home')) type = 'Home';

        const price_per_night = parseFloat(propertyData.price_per_night || propertyData.price) || 0;
        const status = propertyData.status || 'Active';
        const location = propertyData.location || null;
        const address = propertyData.address || null;
        const latitude = propertyData.latitude ? parseFloat(propertyData.latitude) : null;
        const longitude = propertyData.longitude ? parseFloat(propertyData.longitude) : null;
        const main_image = propertyData.main_image || propertyData.image || null;
        const owner_id = propertyData.owner_id || propertyData.ownerId || null;
        const owner_name = propertyData.owner_name || propertyData.ownerName || null;
        const owner_phone = propertyData.owner_phone || propertyData.ownerPhone || null;
        const owner_email = propertyData.owner_email || propertyData.ownerEmail || null;
        const bedrooms = parseInt(propertyData.bedrooms) || 1;
        const bathrooms = parseInt(propertyData.bathrooms) || 1;
        const max_guests = parseInt(propertyData.maxGuests || propertyData.max_guests) || 2;

        console.log('Final mapping for Repository create:', { owner_name, owner_phone, owner_email });

        const [result] = await pool.execute(
            'INSERT INTO properties (name, description, type, price_per_night, status, location, address, latitude, longitude, main_image, owner_id, owner_name, owner_phone, owner_email, bedrooms, bathrooms, max_guests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, type, price_per_night, status, location, address, latitude, longitude, main_image, owner_id, owner_name, owner_phone, owner_email, bedrooms, bathrooms, max_guests]
        );
        console.log('✅ Property Created in DB:', result.insertId);
        return result.insertId;
    }

    async update(id, propertyData) {
        // Build only the fields that are actually provided and valid
        const updateFields = {};

        if (propertyData.name !== undefined) updateFields.name = propertyData.name;
        if (propertyData.description !== undefined) updateFields.description = propertyData.description;
        if (propertyData.type !== undefined) {
            const rawType = propertyData.type.toLowerCase();
            if (rawType.includes('apartment')) updateFields.type = 'Apartment';
            else if (rawType.includes('villa')) updateFields.type = 'Villa';
            else if (rawType.includes('cabin')) updateFields.type = 'Cabin';
            else if (rawType.includes('loft')) updateFields.type = 'Loft';
            else updateFields.type = 'Home';
        }
        if (propertyData.price_per_night !== undefined) updateFields.price_per_night = parseFloat(propertyData.price_per_night);
        if (propertyData.price !== undefined) updateFields.price_per_night = parseFloat(propertyData.price);
        if (propertyData.status !== undefined) updateFields.status = propertyData.status;
        if (propertyData.location !== undefined) updateFields.location = propertyData.location;
        if (propertyData.address !== undefined) updateFields.address = propertyData.address;
        if (propertyData.main_image !== undefined) updateFields.main_image = propertyData.main_image;
        if (propertyData.image !== undefined) updateFields.main_image = propertyData.image;
        if (propertyData.owner_name !== undefined) updateFields.owner_name = propertyData.owner_name;
        if (propertyData.ownerName !== undefined) updateFields.owner_name = propertyData.ownerName;
        if (propertyData.owner_phone !== undefined) updateFields.owner_phone = propertyData.owner_phone;
        if (propertyData.ownerPhone !== undefined) updateFields.owner_phone = propertyData.ownerPhone;
        if (propertyData.owner_email !== undefined) updateFields.owner_email = propertyData.owner_email;
        if (propertyData.ownerEmail !== undefined) updateFields.owner_email = propertyData.ownerEmail;
        if (propertyData.bedrooms !== undefined) updateFields.bedrooms = parseInt(propertyData.bedrooms);
        if (propertyData.bathrooms !== undefined) updateFields.bathrooms = parseInt(propertyData.bathrooms);
        if (propertyData.maxGuests !== undefined) updateFields.max_guests = parseInt(propertyData.maxGuests);
        if (propertyData.max_guests !== undefined) updateFields.max_guests = parseInt(propertyData.max_guests);

        if (Object.keys(updateFields).length === 0) return false;

        const fields = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateFields), id];
        console.log('SQL UPDATE properties:', `UPDATE properties SET ${fields} WHERE id = ?`, values);
        const [result] = await pool.execute(`UPDATE properties SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await pool.execute('DELETE FROM properties WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findAmenitiesByPropertyId(propertyId) {
        const [rows] = await pool.execute(
            'SELECT a.* FROM amenities a JOIN property_amenities pa ON a.id = pa.amenity_id WHERE pa.property_id = ?',
            [propertyId]
        );
        return rows;
    }

    async syncAmenities(propertyId, amenities) {
        // Delete existing links
        await pool.execute('DELETE FROM property_amenities WHERE property_id = ?', [propertyId]);

        if (!amenities || !amenities.length) return;

        for (const amenityName of amenities) {
            // Find or create amenity
            let [rows] = await pool.execute('SELECT id FROM amenities WHERE name = ?', [amenityName]);
            let amenityId;

            if (rows.length === 0) {
                const [result] = await pool.execute('INSERT INTO amenities (name) VALUES (?)', [amenityName]);
                amenityId = result.insertId;
            } else {
                amenityId = rows[0].id;
            }

            // Link amenity to property
            await pool.execute('INSERT IGNORE INTO property_amenities (property_id, amenity_id) VALUES (?, ?)', [propertyId, amenityId]);
        }
    }

    async findImagesByPropertyId(propertyId) {
        const [rows] = await pool.execute('SELECT image_url FROM property_images WHERE property_id = ?', [propertyId]);
        return rows.map(r => r.image_url);
    }

    async syncImages(propertyId, images) {
        // Delete existing links
        await pool.execute('DELETE FROM property_images WHERE property_id = ?', [propertyId]);

        if (!images || !images.length) return;

        for (const imageUrl of images) {
            await pool.execute('INSERT INTO property_images (property_id, image_url) VALUES (?, ?)', [propertyId, imageUrl]);
        }
    }
}

module.exports = new PropertiesRepository();
