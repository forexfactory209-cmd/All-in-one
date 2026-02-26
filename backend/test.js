const db = require('./db');

db.query('SELECT 1', (err, result) => {
    if (err) throw err;
    console.log('Database working');
    process.exit(0);
});
