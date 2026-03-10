const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');
require('dotenv').config();

async function fix() {
    const localPort = 3316;
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

        console.log('Fixing car ID 2 data...');
        await pool.execute(`
      UPDATE rental_cars 
      SET 
        owner_name = 'Ismail Somstay',
        owner_phone = '+252-907123456',
        owner_email = 'ismail@somstay.so',
        rating = 4.8,
        reviews_count = 12,
        make = 'Toyota RAV4',
        model = 'Adventure',
        year = 2022,
        description = 'Premium 4x4 SUV perfect for both city drives and rough terrains. Meticulously maintained with leather interior and full safety features.'
      WHERE id = 2
    `);
        console.log('✅ Car 2 fixed');

        console.log('Fixing car ID 1 data...');
        await pool.execute(`
      UPDATE rental_cars 
      SET 
        make = 'Toyota Harrier',
        model = 'Premium',
        year = 2018,
        price_per_day = 35.00
      WHERE id = 1
    `);
        console.log('✅ Car 1 fixed');

        process.exit(0);
    } catch (err) {
        console.error('❌ Failed:', err);
        process.exit(1);
    }
}
fix();
