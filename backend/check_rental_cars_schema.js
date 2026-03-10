const db = require('./src/config/database');

async function check() {
    try {
        await db.initDatabase();
        const [rows] = await db.execute('DESCRIBE rental_cars');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
