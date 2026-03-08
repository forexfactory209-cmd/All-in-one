const pool = require('../../config/database');

class WishlistRepository {
    async findByUserId(userId) {
        // Returns both hotels and properties in the wishlist
        try {
            const [wishlistRows] = await pool.execute(
                'SELECT * FROM wishlist WHERE user_id = ? ORDER BY created_at DESC',
                [userId]
            );

            if (wishlistRows.length === 0) return [];

            const hotelIds = wishlistRows.filter(w => w.entity_type === 'Hotel').map(w => w.entity_id);
            const propertyIds = wishlistRows.filter(w => w.entity_type === 'Property' || w.entity_type === 'Room').map(w => w.entity_id);
            // Wait, previous code only handled 'Hotel' and 'Property'

            const hotelsMap = {};
            if (hotelIds.length > 0) {
                const placeholders = hotelIds.map(() => '?').join(',');
                const [hotels] = await pool.execute(
                    `SELECT id, name, location, main_image, base_price FROM hotels WHERE id IN (${placeholders})`, 
                    hotelIds
                );
                hotels.forEach(h => hotelsMap[h.id] = h);
            }

            const propertiesMap = {};
            if (propertyIds.length > 0) {
                const placeholders = propertyIds.map(() => '?').join(',');
                const [properties] = await pool.execute(
                    `SELECT id, name, location, main_image, price_per_night FROM properties WHERE id IN (${placeholders})`, 
                    propertyIds
                );
                properties.forEach(p => propertiesMap[p.id] = p);
            }

            return wishlistRows.map(w => {
                const entityDetails = w.entity_type === 'Hotel' ? hotelsMap[w.entity_id] : propertiesMap[w.entity_id];
                if (!entityDetails) return w; // fallback if entity deleted
                return {
                    ...w,
                    name: entityDetails.name,
                    location: entityDetails.location,
                    image: entityDetails.main_image,
                    price: w.entity_type === 'Hotel' ? entityDetails.base_price : entityDetails.price_per_night
                };
            });
        } catch (error) {
            if (error.code === 'ER_NO_SUCH_TABLE') {
                console.warn('⚠️ Wishlist table does not exist yet.');
                return [];
            }
            throw error;
        }
    }

    async toggle(userId, entityType, entityId) {
        const [deleteResult] = await pool.execute(
            'DELETE FROM wishlist WHERE user_id = ? AND entity_type = ? AND entity_id = ?',
            [userId, entityType, entityId]
        );
        
        if (deleteResult.affectedRows > 0) {
            return false; // Removed
        }

        await pool.execute(
            'INSERT IGNORE INTO wishlist (user_id, entity_type, entity_id) VALUES (?, ?, ?)',
            [userId, entityType, entityId]
        );
        return true; // Added
    }
}

module.exports = new WishlistRepository();
