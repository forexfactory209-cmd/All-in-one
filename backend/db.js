const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'app_user',
    password: 'cashka1234@',
    database: 'hotel_app'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('MySQL connected successfully');
});

module.exports = db;
