const db = require('./src/config/database');

async function check() {
    try {
        await db.initDatabase();
        const [hotels] = await db.execute('SELECT * FROM hotels');
        const [rooms] = await db.execute('SELECT * FROM rooms');
        console.log('Hotels:', JSON.stringify(hotels, null, 2));
        console.log('Rooms:', JSON.stringify(rooms, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
