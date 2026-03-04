const pool = require('../../config/database');

class HotelsRepository {
    async findAll(limit = 10, offset = 0, filters = {}) {
        let query = 'SELECT * FROM hotels WHERE 1=1';
        const queryParams = [];

        if (filters.city) {
            query += ' AND location = ?';
            queryParams.push(filters.city);
        }
        if (filters.type) {
            query += ' AND type = ?';
            queryParams.push(filters.type);
        }
        if (filters.minPrice) {
            query += ' AND base_price >= ?';
            queryParams.push(parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            query += ' AND base_price <= ?';
            queryParams.push(parseFloat(filters.maxPrice));
        }
        if (filters.verifiedOnly) {
            query += ' AND status = "Active"'; // Or a specific verified column if added
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(limit.toString(), offset.toString());

        const [rows] = await pool.execute(query, queryParams);
        return rows;
    }

    async countAll(filters = {}) {
        let query = 'SELECT COUNT(*) as count FROM hotels WHERE 1=1';
        const queryParams = [];

        if (filters.city) {
            query += ' AND location = ?';
            queryParams.push(filters.city);
        }
        if (filters.type) {
            query += ' AND type = ?';
            queryParams.push(filters.type);
        }
        if (filters.minPrice) {
            query += ' AND base_price >= ?';
            queryParams.push(parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            query += ' AND base_price <= ?';
            queryParams.push(parseFloat(filters.maxPrice));
        }

        const [rows] = await pool.execute(query, queryParams);
        return rows[0].count;
    }

    async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM hotels WHERE id = ?', [id]);
        if (!rows[0]) return null;

        const hotel = rows[0];
        hotel.images = await this.findImagesByHotelId(id);
        return hotel;
    }

    async create(hotelData) {
        const name = hotelData.name;
        const description = hotelData.description || null;
        const location = hotelData.location || null;
        const address = hotelData.address || null;
        const latitude = hotelData.latitude ? parseFloat(hotelData.latitude) : null;
        const longitude = hotelData.longitude ? parseFloat(hotelData.longitude) : null;
        const total_rooms = parseInt(hotelData.total_rooms || hotelData.totalRooms) || 0;
        const available_rooms = parseInt(hotelData.available_rooms || hotelData.availableRooms || total_rooms) || 0;
        const base_price = parseFloat(hotelData.base_price || hotelData.basePrice) || 0;
        const status = hotelData.status || 'Active';
        const main_image = hotelData.main_image || hotelData.image || null;
        const rating = parseFloat(hotelData.rating) || 4.5;
        const owner_name = hotelData.owner_name || hotelData.ownerName || null;
        const owner_phone = hotelData.owner_phone || hotelData.ownerPhone || null;
        const owner_email = hotelData.owner_email || hotelData.ownerEmail || null;

        console.log('Final mapping for Hotel Repository create:', { owner_name, owner_phone, owner_email });

        const [result] = await pool.execute(
            'INSERT INTO hotels (name, description, location, address, latitude, longitude, total_rooms, available_rooms, base_price, status, main_image, rating, owner_name, owner_phone, owner_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, location, address, latitude, longitude, total_rooms, available_rooms, base_price, status, main_image, rating, owner_name, owner_phone, owner_email]
        );
        console.log('✅ Hotel Created in DB:', result.insertId);
        return result.insertId;
    }

    async update(id, hotelData) {
        const updateFields = {};

        if (hotelData.name !== undefined) updateFields.name = hotelData.name;
        if (hotelData.description !== undefined) updateFields.description = hotelData.description;
        if (hotelData.location !== undefined) updateFields.location = hotelData.location;
        if (hotelData.address !== undefined) updateFields.address = hotelData.address;
        if (hotelData.total_rooms !== undefined) updateFields.total_rooms = parseInt(hotelData.total_rooms);
        if (hotelData.totalRooms !== undefined) updateFields.total_rooms = parseInt(hotelData.totalRooms);
        if (hotelData.available_rooms !== undefined) updateFields.available_rooms = parseInt(hotelData.available_rooms);
        if (hotelData.availableRooms !== undefined) updateFields.available_rooms = parseInt(hotelData.availableRooms);
        if (hotelData.base_price !== undefined) updateFields.base_price = parseFloat(hotelData.base_price);
        if (hotelData.basePrice !== undefined) updateFields.base_price = parseFloat(hotelData.basePrice);
        if (hotelData.status !== undefined) updateFields.status = hotelData.status;
        if (hotelData.main_image !== undefined) updateFields.main_image = hotelData.main_image;
        if (hotelData.image !== undefined) updateFields.main_image = hotelData.image;
        if (hotelData.rating !== undefined) updateFields.rating = parseFloat(hotelData.rating);
        if (hotelData.owner_name !== undefined) updateFields.owner_name = hotelData.owner_name;
        if (hotelData.ownerName !== undefined) updateFields.owner_name = hotelData.ownerName;
        if (hotelData.owner_phone !== undefined) updateFields.owner_phone = hotelData.owner_phone;
        if (hotelData.ownerPhone !== undefined) updateFields.owner_phone = hotelData.ownerPhone;
        if (hotelData.owner_email !== undefined) updateFields.owner_email = hotelData.owner_email;
        if (hotelData.ownerEmail !== undefined) updateFields.owner_email = hotelData.ownerEmail;

        if (Object.keys(updateFields).length === 0) return false;

        const fields = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateFields), id];
        console.log('SQL UPDATE hotels:', `UPDATE hotels SET ${fields} WHERE id = ?`, values);
        const [result] = await pool.execute(`UPDATE hotels SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await pool.execute('DELETE FROM hotels WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findAmenitiesByHotelId(hotelId) {
        const [rows] = await pool.execute(
            'SELECT a.* FROM amenities a JOIN hotel_amenities ha ON a.id = ha.amenity_id WHERE ha.hotel_id = ?',
            [hotelId]
        );
        return rows;
    }

    async syncAmenities(hotelId, amenities) {
        // Delete existing links
        await pool.execute('DELETE FROM hotel_amenities WHERE hotel_id = ?', [hotelId]);

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

            // Link amenity to hotel
            await pool.execute('INSERT IGNORE INTO hotel_amenities (hotel_id, amenity_id) VALUES (?, ?)', [hotelId, amenityId]);
        }
    }

    async findImagesByHotelId(hotelId) {
        const [rows] = await pool.execute('SELECT image_url FROM property_images WHERE hotel_id = ?', [hotelId]);
        return rows.map(r => r.image_url);
    }

    async syncImages(hotelId, images) {
        // Delete existing links
        await pool.execute('DELETE FROM property_images WHERE hotel_id = ?', [hotelId]);

        if (!images || !images.length) return;

        for (const imageUrl of images) {
            await pool.execute('INSERT INTO property_images (hotel_id, image_url) VALUES (?, ?)', [hotelId, imageUrl]);
        }
    }

    async findUniqueLocations() {
        const [rows] = await pool.execute(
            'SELECT DISTINCT location as name, main_image as image FROM hotels WHERE location IS NOT NULL AND location != ""'
        );
        return rows;
    }
}

module.exports = new HotelsRepository();
