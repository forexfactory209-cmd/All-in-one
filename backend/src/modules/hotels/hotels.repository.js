const pool = require('../../config/database');

class HotelsRepository {
    async findAll(limit = 10, offset = 0, filters = {}, options = {}) {
        const safeLimit = Math.min(parseInt(limit) || 10, 50);
        const safeOffset = Math.max(parseInt(offset) || 0, 0);

        let fields = 'h.id, h.name, h.location, h.type, h.base_price, h.rating, h.main_image, h.status';
        if (!options.simplified) {
            fields += ', h.description, h.address, h.total_rooms, h.available_rooms, h.latitude, h.longitude';
        }

        let query = `SELECT ${fields} FROM hotels h WHERE h.deleted_at IS NULL`;
        const queryParams = [];

        if (filters.city && filters.city !== '' && filters.city !== 'All') {
            query += ' AND (h.location = ? OR h.location LIKE ?)';
            queryParams.push(filters.city, `%${filters.city}%`);
        }

        if (filters.type && filters.type !== '' && filters.type !== 'All') {
            const typeFilter = filters.type.replace(' Hotel', '');
            query += ' AND h.type LIKE ?';
            queryParams.push(`%${typeFilter}%`);
        } else if (filters.propertyType && filters.propertyType !== '' && filters.propertyType !== 'All') {
            const typeFilter = filters.propertyType.replace(' Hotel', '');
            query += ' AND h.type LIKE ?';
            queryParams.push(`%${typeFilter}%`);
        }

        const minP = filters.minPrice || (filters.priceRange && filters.priceRange[0]);
        if (minP !== undefined && minP !== null) {
            query += ' AND h.base_price >= ?';
            queryParams.push(parseFloat(minP));
        }

        const maxP = filters.maxPrice || (filters.priceRange && filters.priceRange[1]);
        if (maxP !== undefined && maxP !== null) {
            query += ' AND h.base_price <= ?';
            queryParams.push(parseFloat(maxP));
        }

        if (filters.verifiedOnly === 'true' || filters.verifiedOnly === true) {
            query += ' AND h.status = "Active"';
        }

        let orderBy = 'h.created_at DESC';
        if (filters.sort === 'price_low') orderBy = 'h.base_price ASC';
        else if (filters.sort === 'price_high') orderBy = 'h.base_price DESC';
        else if (filters.sort === 'top_rated') orderBy = 'h.rating DESC';

        query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
        queryParams.push(safeLimit, safeOffset);

        // Using .query instead of .execute to avoid 'Incorrect arguments' error with LIMIT/OFFSET on some versions
        const [rows] = await pool.query(query, queryParams);
        return rows;
    }

    async countAll(filters = {}) {
        let query = 'SELECT COUNT(*) as count FROM hotels WHERE deleted_at IS NULL';
        const queryParams = [];

        if (filters.city || filters.destination) {
            const dest = filters.city || filters.destination;
            if (dest && dest !== '') {
                query += ' AND location = ?';
                queryParams.push(dest);
            }
        }
        if (filters.type || filters.propertyType) {
            const raw = (filters.type || filters.propertyType);
            if (raw && raw !== 'All') {
                const typeFilter = raw.replace(' Hotel', '');
                query += ' AND type LIKE ?';
                queryParams.push(`%${typeFilter}%`);
            }
        }
        if (filters.minPrice || (filters.priceRange && filters.priceRange[0])) {
            query += ' AND base_price >= ?';
            queryParams.push(parseFloat(filters.minPrice || filters.priceRange[0]));
        }
        if (filters.maxPrice || (filters.priceRange && filters.priceRange[1])) {
            query += ' AND base_price <= ?';
            queryParams.push(parseFloat(filters.maxPrice || filters.priceRange[1]));
        }
        if (filters.verifiedOnly === 'true' || filters.verifiedOnly === true) {
            query += ' AND status = "Active"';
        }

        const [rows] = await pool.query(query, queryParams);
        return rows[0].count;
    }

    async findById(id) {
        const query = `
            SELECT id, name, description, type, location, address, latitude, longitude, 
                   total_rooms as totalRooms, available_rooms as availableRooms, 
                   base_price as basePrice, status, main_image as image, rating, 
                   owner_name, owner_phone, owner_email 
            FROM hotels 
            WHERE id = ? AND deleted_at IS NULL
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    }

    async create(hotelData) {
        const name = hotelData.name;
        const description = hotelData.description || null;
        const type = hotelData.type || 'Hotel';
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

        console.log('Final mapping for Hotel Repository create:', { owner_name, owner_phone, owner_email, type });

        const [result] = await pool.execute(
            'INSERT INTO hotels (name, description, type, location, address, latitude, longitude, total_rooms, available_rooms, base_price, status, main_image, rating, owner_name, owner_phone, owner_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, type, location, address, latitude, longitude, total_rooms, available_rooms, base_price, status, main_image, rating, owner_name, owner_phone, owner_email]
        );
        console.log('✅ Hotel Created in DB:', result.insertId);
        return result.insertId;
    }

    async update(id, hotelData) {
        const updateFields = {};

        if (hotelData.name !== undefined) updateFields.name = hotelData.name;
        if (hotelData.description !== undefined) updateFields.description = hotelData.description;
        if (hotelData.type !== undefined) updateFields.type = hotelData.type;
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
        const [result] = await pool.execute('UPDATE hotels SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
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
            'SELECT DISTINCT location FROM hotels WHERE location IS NOT NULL AND status = "Active" AND deleted_at IS NULL'
        );
        return rows;
    }

    async findAmenitiesByHotelIds(hotelIds) {
        if (!hotelIds || hotelIds.length === 0) return {};
        const placeholders = hotelIds.map(() => '?').join(',');
        const [rows] = await pool.execute(
            `SELECT ha.hotel_id, a.* FROM amenities a JOIN hotel_amenities ha ON a.id = ha.amenity_id WHERE ha.hotel_id IN (${placeholders})`,
            hotelIds
        );

        const map = {};
        rows.forEach(row => {
            if (!map[row.hotel_id]) map[row.hotel_id] = [];
            map[row.hotel_id].push(row);
        });
        return map;
    }

    async findImagesByHotelIds(hotelIds) {
        if (!hotelIds || hotelIds.length === 0) return {};
        const placeholders = hotelIds.map(() => '?').join(',');
        const [rows] = await pool.execute(
            `SELECT hotel_id, image_url FROM property_images WHERE hotel_id IN (${placeholders})`,
            hotelIds
        );

        const map = {};
        rows.forEach(row => {
            if (!map[row.hotel_id]) map[row.hotel_id] = [];
            map[row.hotel_id].push(row.image_url);
        });
        return map;
    }
}

module.exports = new HotelsRepository();
