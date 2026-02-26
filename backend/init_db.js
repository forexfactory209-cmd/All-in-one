const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDb() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        console.log(`Using database: ${process.env.DB_NAME}`);
        const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
        await connection.query(sql);
        console.log('✅ Database schema applied successfully');
    } catch (error) {
        console.error('❌ Error applying schema:', error);
    } finally {
        await connection.end();
    }
}

initDb();
