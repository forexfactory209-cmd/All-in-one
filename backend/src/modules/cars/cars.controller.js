const pool = require('../../config/database');
const { sendResponse, sendError } = require('../../utils/response');

class CarsController {
    async getAllCars(req, res) {
        try {
            const [rows] = await pool.query('SELECT * FROM rental_cars ORDER BY created_at DESC');
            const [images] = await pool.query('SELECT car_id, image_url FROM property_images WHERE car_id IS NOT NULL');

            const imageMap = {};
            images.forEach(img => {
                if (!imageMap[img.car_id]) imageMap[img.car_id] = [];
                imageMap[img.car_id].push(img.image_url);
            });

            const cars = rows.map(car => ({
                ...car,
                images: imageMap[car.id] || []
            }));

            return sendResponse(res, 200, true, 'Cars retrieved successfully', cars);
        } catch (error) {
            console.error('Error fetching cars:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getCarById(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await pool.execute('SELECT * FROM rental_cars WHERE id = ?', [id]);
            if (rows.length === 0) return sendError(res, 404, 'Car not found');

            const [images] = await pool.execute('SELECT image_url FROM property_images WHERE car_id = ?', [id]);
            const car = { ...rows[0], images: images.map(img => img.image_url) };

            return sendResponse(res, 200, true, 'Car retrieved successfully', car);
        } catch (error) {
            console.error('Error fetching car:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async createCar(req, res) {
        try {
            const { make, model, year, description, price_per_day, status, location, transmission, seats, doors, main_image, owner_name, owner_phone, owner_email, rating, images } = req.body;

            const [result] = await pool.execute(
                `INSERT INTO rental_cars (make, model, year, description, price_per_day, status, location, transmission, seats, doors, main_image, owner_name, owner_phone, owner_email, rating) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [make, model, year || 2020, description, price_per_day || 0, status || 'Available', location || 'Hargeisa', transmission || 'Automatic', seats || 4, doors || 4, (images && images.length > 0 ? images[0] : main_image) || null, owner_name || null, owner_phone || null, owner_email || null, rating || 0.0]
            );

            if (images && images.length > 0) {
                for (const url of images) {
                    await pool.execute('INSERT INTO property_images (car_id, image_url) VALUES (?, ?)', [result.insertId, url]);
                }
            }

            return sendResponse(res, 201, true, 'Car created successfully', { id: result.insertId });
        } catch (error) {
            console.error('Error creating car:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async updateCar(req, res) {
        try {
            const { id } = req.params;
            const updates = { ...req.body };
            const images = updates.images;
            delete updates.images;

            if (images !== undefined) {
                if (images.length > 0) updates.main_image = images[0];
                await pool.execute('DELETE FROM property_images WHERE car_id = ?', [id]);
                for (const url of images) {
                    await pool.execute('INSERT INTO property_images (car_id, image_url) VALUES (?, ?)', [id, url]);
                }
            }

            if (Object.keys(updates).length > 0) {
                const fields = [];
                const values = [];
                for (const [k, v] of Object.entries(updates)) {
                    fields.push(`${k} = ?`);
                    values.push(v);
                }
                values.push(id);
                const [result] = await pool.execute(`UPDATE rental_cars SET ${fields.join(', ')} WHERE id = ?`, values);
                if (result.affectedRows === 0 && images === undefined) return sendError(res, 404, 'Car not found');
            }

            return sendResponse(res, 200, true, 'Car updated successfully');
        } catch (error) {
            console.error('Error updating car:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async deleteCar(req, res) {
        try {
            const { id } = req.params;
            const [result] = await pool.execute('DELETE FROM rental_cars WHERE id = ?', [id]);
            if (result.affectedRows === 0) return sendError(res, 404, 'Car not found');
            return sendResponse(res, 200, true, 'Car deleted successfully');
        } catch (error) {
            console.error('Error deleting car:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }
}

module.exports = new CarsController();
