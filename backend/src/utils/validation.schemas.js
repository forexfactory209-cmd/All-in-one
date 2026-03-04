const { z } = require('zod');

const hotelSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Name must be at least 3 characters'),
        description: z.string().optional(),
        location: z.string().min(2, 'Location is required'),
        address: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        total_rooms: z.number().int().positive('Total rooms must be positive').optional(),
        available_rooms: z.number().int().nonnegative().optional(),
        base_price: z.number().positive('Base price must be positive').optional(),
        status: z.enum(['Active', 'Inactive', 'Fully Booked', 'Under Renovation']).optional(),
        main_image: z.string().url('Invalid image URL').optional(),
        rating: z.number().min(0).max(5).optional(),
        amenities: z.array(z.string()).optional(),
        images: z.array(z.string().url()).optional(),
    })
});

const propertySchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Name must be at least 3 characters'),
        description: z.string().optional(),
        type: z.enum(['Home', 'Apartment', 'Villa', 'Cabin', 'Loft']).optional(),
        price_per_night: z.number().positive('Price must be positive'),
        status: z.enum(['Active', 'Inactive', 'Fully Booked', 'Pending']).optional(),
        location: z.string().min(2, 'Location is required'),
        address: z.string().optional(),
        main_image: z.string().url().optional(),
        bedrooms: z.number().int().positive().optional(),
        bathrooms: z.number().int().positive().optional(),
        max_guests: z.number().int().positive().optional(),
        amenities: z.array(z.string()).optional(),
        images: z.array(z.string().url()).optional(),
    })
});

const bookingSchema = z.object({
    body: z.object({
        user_id: z.number().int().positive(),
        entity_type: z.enum(['Property', 'Room']),
        entity_id: z.number().int().positive(),
        check_in: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid check-in date'),
        check_out: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid check-out date'),
        total_price: z.number().positive(),
        status: z.enum(['Pending', 'Confirmed', 'Cancelled', 'Completed']).optional(),
        payment_status: z.enum(['Unpaid', 'Paid', 'Refunded']).optional(),
    })
});

module.exports = {
    hotelSchema,
    propertySchema,
    bookingSchema
};
