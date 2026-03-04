const pool = require('../../config/database');

class RoomsRepository {
    async findAllByHotelId(hotelId, limit = 10, offset = 0) {
        const [rows] = await pool.execute(
            'SELECT * FROM rooms WHERE hotel_id = ? ORDER BY room_number ASC LIMIT ? OFFSET ?',
            [hotelId, limit.toString(), offset.toString()]
        );
        const rooms = await Promise.all(rows.map(async (room) => {
            room.images = await this.findImagesByRoomId(room.id);
            return room;
        }));
        return rooms;
    }

    async countByHotelId(hotelId) {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM rooms WHERE hotel_id = ?', [hotelId]);
        return rows[0].count;
    }

    async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM rooms WHERE id = ?', [id]);
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
        const [result] = await pool.execute('DELETE FROM rooms WHERE id = ?', [id]);
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
