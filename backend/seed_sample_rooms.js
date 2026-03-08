require('dotenv').config();
const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');

(async () => {
    const localPort = 3333;
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

    console.log('--- INSERTING SAMPLE ROOMS ---');
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

        // Get all hotels
        const [hotels] = await pool.execute('SELECT id, name FROM hotels');
        
        for (const hotel of hotels) {
            console.log(`Adding rooms for ${hotel.name}...`);
            
            const roomTypes = [
                { type: 'Standard', price: 45, beds: 1 },
                { type: 'Deluxe', price: 85, beds: 1 },
                { type: 'Executive', price: 150, beds: 2 },
                { type: 'Suite', price: 250, beds: 2 },
                { type: 'Presidential', price: 500, beds: 3 },
                { type: 'Family', price: 180, beds: 3 }
            ];

            for (let i = 0; i < roomTypes.length; i++) {
                const rt = roomTypes[i];
                const roomNum = `${100 + i + 1}`;
                
                // Check if exists
                const [exists] = await pool.execute('SELECT id FROM rooms WHERE hotel_id = ? AND room_number = ?', [hotel.id, roomNum]);
                if (exists.length === 0) {
                    await pool.execute(
                        'INSERT INTO rooms (hotel_id, room_number, type, price, beds, max_guests, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [hotel.id, roomNum, rt.type, rt.price, rt.beds, rt.beds * 2, 'Available', `A beautiful ${rt.type} room with ${rt.beds} beds.`]
                    );
                }
            }
        }
        
        await pool.end();
        console.log('✅ Sample rooms added successfully!');
    } catch (err) {
        console.error('❌ Error seeding rooms:', err.message);
    }
    process.exit(0);
})();
