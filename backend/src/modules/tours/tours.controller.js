const pool = require('../../config/database');
const { sendResponse, sendError } = require('../../utils/response');

class ToursController {
    async getAllTours(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM city_tours ORDER BY created_at DESC');
            return sendResponse(res, 200, true, 'Tours retrieved successfully', rows);
        } catch (error) {
            console.error('Error fetching tours:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getTourById(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await pool.execute('SELECT * FROM city_tours WHERE id = ?', [id]);
            if (rows.length === 0) return sendError(res, 404, 'Tour not found');
            return sendResponse(res, 200, true, 'Tour retrieved successfully', rows[0]);
        } catch (error) {
            console.error('Error fetching tour:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async createTour(req, res) {
        try {
            const { title, description, price_per_person, duration_hours, location, status, max_participants, main_image, guide_name, guide_phone } = req.body;
            
            const [result] = await pool.execute(
                `INSERT INTO city_tours (title, description, price_per_person, duration_hours, location, status, max_participants, main_image, guide_name, guide_phone) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, description, price_per_person || 0, duration_hours || 1, location || 'Hargeisa', status || 'Active', max_participants || 10, main_image || null, guide_name || null, guide_phone || null]
            );
            return sendResponse(res, 201, true, 'Tour created successfully', { id: result.insertId });
        } catch (error) {
            console.error('Error creating tour:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async updateTour(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            if (Object.keys(updates).length === 0) return sendError(res, 400, 'No data to update');

            const fields = [];
            const values = [];
            for (const [k, v] of Object.entries(updates)) {
                fields.push(`${k} = ?`);
                values.push(v);
            }
            values.push(id);

            const [result] = await pool.execute(`UPDATE city_tours SET ${fields.join(', ')} WHERE id = ?`, values);
            if (result.affectedRows === 0) return sendError(res, 404, 'Tour not found');
            return sendResponse(res, 200, true, 'Tour updated successfully');
        } catch (error) {
            console.error('Error updating tour:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async deleteTour(req, res) {
        try {
            const { id } = req.params;
            const [result] = await pool.execute('DELETE FROM city_tours WHERE id = ?', [id]);
            if (result.affectedRows === 0) return sendError(res, 404, 'Tour not found');
            return sendResponse(res, 200, true, 'Tour deleted successfully');
        } catch (error) {
            console.error('Error deleting tour:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }
}

module.exports = new ToursController();
