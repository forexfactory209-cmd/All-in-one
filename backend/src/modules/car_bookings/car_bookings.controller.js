const pool = require('../../config/database');
const { sendResponse, sendError } = require('../../utils/response');

class CarBookingsController {
    async checkAvailability(req, res) {
        try {
            const { car_id, pickup_date, return_date } = req.body;
            if (!car_id || !pickup_date || !return_date) {
                return sendError(res, 400, 'Missing car_id, pickup_date, or return_date');
            }

            const [rows] = await pool.execute(`
                SELECT id 
                FROM car_bookings 
                WHERE car_id = ? 
                AND status IN ('pending','confirmed','active') 
                AND (pickup_date < ? AND return_date > ?)
            `, [car_id, return_date, pickup_date]);

            if (rows.length > 0) {
                return sendResponse(res, 200, false, 'Car is not available for selected dates');
            }
            
            return sendResponse(res, 200, true, 'Car is available');
        } catch (error) {
            console.error('Check Availability Error:', error);
            return sendError(res, 500, 'Failed to check availability');
        }
    }

    async createBooking(req, res) {
        let connection;
        try {
            const { 
                user_id, car_id, pickup_date, return_date, pickup_location, dropoff_location,
                total_price, deposit, insurance_plan, delivery_type, hotel_id, hotel_room, delivery_time, add_ons,
                driver_info // Object containing driver details
            } = req.body;

            connection = await pool.getConnection();
            await connection.beginTransaction();

            // Double Booking Prevention
            const [overlapping] = await connection.execute(`
                SELECT id 
                FROM car_bookings 
                WHERE car_id = ? 
                AND status IN ('pending','confirmed','active') 
                AND (pickup_date < ? AND return_date > ?)
                FOR UPDATE
            `, [car_id, return_date, pickup_date]);

            if (overlapping.length > 0) {
                await connection.rollback();
                return sendError(res, 400, 'Car is already booked for these dates');
            }

            // Insert Booking
            const [bookingResult] = await connection.execute(`
                INSERT INTO car_bookings (
                    user_id, car_id, pickup_date, return_date, pickup_location, dropoff_location,
                    total_price, deposit, insurance_plan, delivery_type, hotel_id, hotel_room, delivery_time, add_ons
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                user_id || 1, car_id, pickup_date, return_date, pickup_location, dropoff_location,
                total_price, deposit, insurance_plan, delivery_type || null, hotel_id || null, hotel_room || null, delivery_time || null, JSON.stringify(add_ons || {})
            ]);

            const booking_id = bookingResult.insertId;

            // Insert Driver Info
            if (driver_info) {
                await connection.execute(`
                    INSERT INTO driver_info (
                        booking_id, full_name, phone_number, email, dob, nationality, city, country,
                        license_number, license_country, license_expiry, license_photo, passport_photo, selfie_photo,
                        emergency_name, emergency_phone, emergency_relation
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    booking_id, driver_info.full_name, driver_info.phone_number, driver_info.email, driver_info.dob,
                    driver_info.nationality, driver_info.city, driver_info.country, driver_info.license_number,
                    driver_info.license_country, driver_info.license_expiry, driver_info.license_photo, 
                    driver_info.passport_photo, driver_info.selfie_photo, driver_info.emergency_name,
                    driver_info.emergency_phone, driver_info.emergency_relation
                ]);
            }

            await connection.commit();
            return sendResponse(res, 201, true, 'Booking confirmed', { booking_id });
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Create Booking Error:', error);
            return sendError(res, 500, 'Failed to create booking');
        } finally {
            if (connection) connection.release();
        }
    }

    async getUserBookings(req, res) {
        try {
            const user_id = req.query.user_id || 1; // Simplification, normally from auth token
            const [rows] = await pool.execute(`
                SELECT cb.*, c.make, c.model, c.year, c.main_image 
                FROM car_bookings cb
                JOIN rental_cars c ON cb.car_id = c.id
                WHERE cb.user_id = ?
                ORDER BY cb.created_at DESC
            `, [user_id]);
            return sendResponse(res, 200, true, 'Bookings retrieved', rows);
        } catch (error) {
            console.error('Error fetching user bookings', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getAllBookings(req, res) {
        try {
            const [rows] = await pool.execute(`
                SELECT cb.*, c.make, c.model, c.year, c.main_image, d.full_name, d.phone_number 
                FROM car_bookings cb
                JOIN rental_cars c ON cb.car_id = c.id
                LEFT JOIN driver_info d ON cb.id = d.booking_id
                ORDER BY cb.created_at DESC
            `);
            return sendResponse(res, 200, true, 'All bookings retrieved', rows);
        } catch (error) {
            console.error('Error fetching all bookings', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async updateBookingStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, payment_status } = req.body;
            const fields = [];
            const values = [];

            if (status) { fields.push('status = ?'); values.push(status); }
            if (payment_status) { fields.push('payment_status = ?'); values.push(payment_status); }

            if (fields.length === 0) return sendError(res, 400, 'No status to update');

            values.push(id);
            await pool.execute(`UPDATE car_bookings SET ${fields.join(', ')} WHERE id = ?`, values);
            
            return sendResponse(res, 200, true, 'Status updated');
        } catch (error) {
            console.error('Error updating status', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }
}

module.exports = new CarBookingsController();
