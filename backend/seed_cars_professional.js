const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');
require('dotenv').config();

async function seed() {
    const localPort = 3318;
    try {
        const tunnelOptions = { autoClose: false };
        const sshOptions = {
            host: process.env.SSH_HOST,
            port: parseInt(process.env.SSH_PORT) || 22,
            username: process.env.SSH_USER,
            password: process.env.SSH_PASS,
        };
        const forwardOptions = {
            srcAddr: '127.0.0.1',
            srcPort: localPort,
            dstAddr: '127.0.0.1',
            dstPort: 3306,
        };
        const serverOptions = { port: localPort };

        await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
        console.log(`SSH tunnel open on port ${localPort}`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const pool = mysql.createPool({
            host: '127.0.0.1',
            port: localPort,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        const cars = [
            {
                id: 1,
                make: 'Range Rover',
                model: 'Vogue SE',
                year: 2023,
                price_per_day: 150,
                main_image: 'https://images.unsplash.com/photo-1606148630730-d38a20468305?auto=format&fit=crop&w=1200',
                transmission: 'Automatic',
                seats: 5,
                doors: 5,
                description: 'Experience unparalleled luxury and off-road capability with the 2023 Range Rover Vogue SE. Perfectly suited for VIP transport and long-distance travel in Hargeisa.',
                owner_name: 'Ahmed Mansoor',
                rating: 4.9,
                reviews_count: 24,
                location: 'Hargeisa'
            },
            {
                id: 2,
                make: 'Toyota',
                model: 'Land Cruiser V8',
                year: 2022,
                price_per_day: 120,
                main_image: 'https://images.unsplash.com/photo-1594976612316-4012bac3ee3e?auto=format&fit=crop&w=1200',
                transmission: 'Automatic',
                seats: 7,
                doors: 5,
                description: 'The king of all terrains. Our Land Cruiser V8 is fully armored and ready for any journey across Somaliland. Premium safety and comfort guaranteed.',
                owner_name: 'Somstay Premium Rentals',
                rating: 4.8,
                reviews_count: 42,
                location: 'Hargeisa'
            }
        ];

        for (const car of cars) {
            await pool.execute(`
        UPDATE rental_cars 
        SET make=?, model=?, year=?, price_per_day=?, main_image=?, transmission=?, seats=?, doors=?, description=?, owner_name=?, rating=?, reviews_count=?, location=?
        WHERE id=?
      `, [car.make, car.model, car.year, car.price_per_day, car.main_image, car.transmission, car.seats, car.doors, car.description, car.owner_name, car.rating, car.reviews_count, car.location, car.id]);
            console.log(`✅ Seeded car ${car.id}: ${car.make} ${car.model}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Failed:', err);
        process.exit(1);
    }
}
seed();
