const pool = require('../../config/database');

class WishlistRepository {
    async findByUserId(userId) {
        // Returns both hotels and properties in the wishlist
        const query = `
            SELECT w.*, 
                   CASE 
                     WHEN w.entity_type = 'Hotel' THEN h.name 
                     WHEN w.entity_type = 'Property' THEN p.name 
                   END as name,
                   CASE 
                     WHEN w.entity_type = 'Hotel' THEN h.location 
                     WHEN w.entity_type = 'Property' THEN p.location 
                   END as location,
                   CASE 
                     WHEN w.entity_type = 'Hotel' THEN h.main_image 
                     WHEN w.entity_type = 'Property' THEN p.main_image 
                   END as image,
                   CASE 
                     WHEN w.entity_type = 'Hotel' THEN h.base_price 
                     WHEN w.entity_type = 'Property' THEN p.price_per_night 
                   END as price
            FROM wishlist w
            LEFT JOIN hotels h ON w.entity_type = 'Hotel' AND w.entity_id = h.id
            LEFT JOIN properties p ON w.entity_type = 'Property' AND w.entity_id = p.id
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
        `;
        const [rows] = await pool.execute(query, [userId]);
        return rows;
    }

    async add(userId, entityType, entityId) {
        const [result] = await pool.execute(
            'INSERT IGNORE INTO wishlist (user_id, entity_type, entity_id) VALUES (?, ?, ?)',
            [userId, entityType, entityId]
        );
        return result.affectedRows > 0;
    }

    async remove(userId, entityType, entityId) {
        const [result] = await pool.execute(
            'DELETE FROM wishlist WHERE user_id = ? AND entity_type = ? AND entity_id = ?',
            [userId, entityType, entityId]
        );
        return result.affectedRows > 0;
    }

    async checkExists(userId, entityType, entityId) {
        const [rows] = await pool.execute(
            'SELECT id FROM wishlist WHERE user_id = ? AND entity_type = ? AND entity_id = ?',
            [userId, entityType, entityId]
        );
        return rows.length > 0;
    }
}

module.exports = new WishlistRepository();
