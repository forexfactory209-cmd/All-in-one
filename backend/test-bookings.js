require('dotenv').config({ path: '.env' });
const pool = require('./src/config/database');

async function test() {
    try {
        await pool.initDatabase();
        const connection = await pool.getConnection();
        const [rows] = await connection.execute("SELECT * FROM bookings WHERE entity_type = 'Room' AND entity_id = 53");
        console.log(JSON.stringify(rows, null, 2));
        connection.release();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();
