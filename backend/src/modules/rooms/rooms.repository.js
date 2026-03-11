const pool = require('../../config/database');

class RoomsRepository {
    async findAll(limit = 10, offset = 0, filters = {}) {
        const safeLimit = Math.min(parseInt(limit) || 10, 50);
        const safeOffset = Math.max(parseInt(offset) || 0, 0);

        const fields = filters.simplified
            ? 'r.id, r.hotel_id, r.room_number, r.type, r.price, r.image_url, h.name as hotel_name, h.location as hotel_location'
            : 'r.*, h.name as hotel_name, h.location as hotel_location, h.main_image as hotel_image, (SELECT GROUP_CONCAT(image_url) FROM property_images WHERE room_id = r.id) as images_list';

        let query = `
            SELECT ${fields}
            FROM rooms r 
            JOIN hotels h ON r.hotel_id = h.id 
            WHERE r.deleted_at IS NULL AND h.deleted_at IS NULL
        `;
        const queryParams = [];

        if (filters.wishlistOnly === 'true' || filters.wishlistOnly === true) {
            const userId = filters.userId || 1;
            query += ' AND r.id IN (SELECT entity_id FROM wishlist WHERE user_id = ? AND (entity_type = "Room" OR entity_type = "Property"))';
            queryParams.push(userId);
        }

        if (filters.city && filters.city !== '' && filters.city !== 'All') {
            query += ' AND (h.location = ? OR h.location LIKE ?)';
            queryParams.push(filters.city, `%${filters.city}%`);
        }

        if (filters.minPrice) {
            query += ' AND r.price >= ?';
            queryParams.push(parseFloat(filters.minPrice));
        }

        if (filters.maxPrice) {
            query += ' AND r.price <= ?';
            queryParams.push(parseFloat(filters.maxPrice));
        }

        query += ` ORDER BY r.created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

        const [rows] = await pool.query(query, queryParams);

        return rows.map(room => ({
            ...room,
            images: room.images_list ? room.images_list.split(',') : []
        }));
    }

    async countAll(filters = {}) {
        let query = `
            SELECT COUNT(*) as count 
            FROM rooms r
            JOIN hotels h ON r.hotel_id = h.id
            WHERE r.deleted_at IS NULL AND h.deleted_at IS NULL
        `;
        const queryParams = [];

        if (filters.wishlistOnly === 'true' || filters.wishlistOnly === true) {
            const userId = filters.userId || 1;
            const [wRows] = await pool.execute('SELECT entity_id FROM wishlist WHERE user_id = ? AND (entity_type = "Room" OR entity_type = "Property")', [userId]);
            if (wRows.length === 0) return 0;
            const wIds = wRows.map(w => w.entity_id);
            const ph = wIds.map(() => '?').join(',');
            query += ` AND r.id IN (${ph})`;
            queryParams.push(...wIds);
        }

        if (filters.city && filters.city !== '' && filters.city !== 'All') {
            query += ' AND (h.location = ? OR h.location LIKE ?)';
            queryParams.push(filters.city, `%${filters.city}%`);
        }

        const [rows] = await pool.execute(query, queryParams);
        return rows[0].count;
    }

    async findAllByHotelId(hotelId, limit = 10, offset = 0) {
        const safeLimit = Math.min(parseInt(limit) || 10, 50);
        const safeOffset = Math.max(parseInt(offset) || 0, 0);

        const [rows] = await pool.query(
            `SELECT * FROM rooms WHERE hotel_id = ? AND deleted_at IS NULL ORDER BY room_number ASC LIMIT ${safeLimit} OFFSET ${safeOffset}`,
            [hotelId]
        );

        if (rows.length > 0) {
            const roomIds = rows.map(r => r.id);
            const allImages = await this.findImagesByRoomIds(roomIds);

            rows.forEach(room => {
                room.images = allImages[room.id] || [];
            });
        }

        return rows;
    }

    async findImagesByRoomIds(roomIds) {
        if (!roomIds || roomIds.length === 0) return {};
        const placeholders = roomIds.map(() => '?').join(',');
        const [rows] = await pool.execute(
            `SELECT room_id, image_url FROM property_images WHERE room_id IN (${placeholders})`,
            roomIds
        );

        const map = {};
        rows.forEach(row => {
            if (!map[row.room_id]) map[row.room_id] = [];
            map[row.room_id].push(row.image_url);
        });
        return map;
    }

    async countByHotelId(hotelId) {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM rooms WHERE hotel_id = ? AND deleted_at IS NULL', [hotelId]);
        return rows[0].count;
    }

    async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM rooms WHERE id = ? AND deleted_at IS NULL', [id]);
        if (!rows[0]) return null;

        const room = rows[0];
        room.images = await this.findImagesByRoomId(id);
        return room;
    }

    async create(roomData) {
        const hotel_id = roomData.hotel_id || roomData.hotelId;
        const room_number = roomData.room_number || roomData.roomNumber;
        const type = roomData.type;
        const price = roomData.price;
        const beds = roomData.beds;
        const max_guests = roomData.max_guests || roomData.maxGuests;
        const status = roomData.status || 'Available';
        const image_url = roomData.image_url || roomData.imageUrl;
        const description = roomData.description;

        const [result] = await pool.execute(
            'INSERT INTO rooms (hotel_id, room_number, type, price, beds, max_guests, status, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [hotel_id, room_number, type, price, beds, max_guests, status, image_url, description]
        );
        return result.insertId;
    }

    async update(id, roomData) {
        const updateFields = {};

        if (roomData.hotel_id !== undefined || roomData.hotelId !== undefined)
            updateFields.hotel_id = roomData.hotel_id || roomData.hotelId;
        if (roomData.room_number !== undefined || roomData.roomNumber !== undefined)
            updateFields.room_number = roomData.room_number || roomData.roomNumber;
        if (roomData.type !== undefined) updateFields.type = roomData.type;
        if (roomData.price !== undefined) updateFields.price = roomData.price;
        if (roomData.beds !== undefined) updateFields.beds = roomData.beds;
        if (roomData.max_guests !== undefined || roomData.maxGuests !== undefined)
            updateFields.max_guests = roomData.max_guests || roomData.maxGuests;
        if (roomData.status !== undefined) updateFields.status = roomData.status;
        if (roomData.image_url !== undefined || roomData.imageUrl !== undefined)
            updateFields.image_url = roomData.image_url || roomData.imageUrl;
        if (roomData.description !== undefined) updateFields.description = roomData.description;

        if (Object.keys(updateFields).length === 0) return false;

        const fields = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateFields), id];

        const [result] = await pool.execute(`UPDATE rooms SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await pool.execute('UPDATE rooms SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findImagesByRoomId(roomId) {
        const [rows] = await pool.execute('SELECT image_url FROM property_images WHERE room_id = ?', [roomId]);
        return rows.map(r => r.image_url);
    }

    async syncImages(roomId, images) {
        // Delete existing links
        await pool.execute('DELETE FROM property_images WHERE room_id = ?', [roomId]);

        if (!images || !images.length) return;

        for (const imageUrl of images) {
            await pool.execute('INSERT INTO property_images (room_id, image_url) VALUES (?, ?)', [roomId, imageUrl]);
        }
    }
}

module.exports = new RoomsRepository();
