require('dotenv').config();
const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');

(async () => {
    const localPort = 3327;
    const sshOptions = {
        host: process.env.SSH_HOST,
        port: parseInt(process.env.SSH_PORT) || 22,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASS
    };
    const forwardOptions = {
        srcAddr: '127.0.0.1',
        srcPort: localPort,
        dstAddr: '127.0.0.1',
        dstPort: parseInt(process.env.DB_PORT) || 3306
    };

    console.log('--- INSERTING SAMPLE HOTELS ---');
    try {
        await createTunnel({ autoClose: true }, { port: localPort }, sshOptions, forwardOptions);
        await new Promise(res => setTimeout(res, 2000));
        
        const pool = mysql.createPool({
            host: '127.0.0.1',
            port: localPort,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        const sampleHotels = [
            { name: 'Burco Palace Hotel', city: 'Burco', type: 'Standard', price: 45, rating: 4.2 },
            { name: 'Berbera Beach Resort', city: 'Berbera', type: 'Luxury', price: 120, rating: 4.8 },
            { name: 'Borama Central Suites', city: 'Borama', type: 'Deluxe', price: 65, rating: 4.5 },
            { name: 'Cerigabo Heights', city: 'Cerigabo', type: 'Boutique', price: 85, rating: 4.6 },
            { name: 'Hargeisa Luxury Grand', city: 'Hargeisa', type: 'Luxury', price: 150, rating: 4.9 },
            { name: 'Mogadishu Waterfront', city: 'Mogadishu', type: 'Luxury', price: 180, rating: 4.7 }
        ];

        for (const h of sampleHotels) {
            // Check if already exists by name
            const [exists] = await pool.execute('SELECT id FROM hotels WHERE name = ?', [h.name]);
            if (exists.length === 0) {
                await pool.execute(
                    'INSERT INTO hotels (name, description, type, location, address, rating, base_price, total_rooms, available_rooms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [h.name, `Welcome to ${h.name} in the heart of ${h.city}. Outstanding ${h.type} experience.`, h.type, h.city, `${h.city} Main St`, h.rating, h.price, 10, 10]
                );
                console.log(`✅ Inserted ${h.name} in ${h.city}`);
            } else {
                // Update type maybe?
                await pool.execute('UPDATE hotels SET type = ?, location = ? WHERE name = ?', [h.type, h.city, h.name]);
                console.log(`ℹ️ Updated ${h.name}`);
            }
        }
        await pool.end();
    } catch (err) {
        console.error('❌ Insert Error:', err.message);
    }
    console.log('--- DONE ---');
    process.exit(0);
})();
