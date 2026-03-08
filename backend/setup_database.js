/**
 * setup_database.js
 *
 * Runs the complete_schema.sql through the SSH tunnel
 * using the same config as the backend server.
 *
 * Usage:
 *   node setup_database.js
 */

const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function run() {
    console.log('\n🔧 Somstay — Database Setup Tool\n');

    const localPort = 3325; // Dedicated port for this setup tool (avoids conflict with running server)

    // ─── Open SSH Tunnel (skip if connecting directly) ───────────────────────
    let useTunnel = Boolean(process.env.SSH_HOST);

    if (useTunnel) {
        const tunnelOptions = { autoClose: true };
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
            dstPort: parseInt(process.env.DB_PORT) || 3306,
        };
        const serverOptions = { port: localPort };

        try {
            console.log(`🔑 Opening SSH tunnel → ${process.env.SSH_HOST}:22 ...`);
            await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
            console.log(`✅ SSH tunnel open on local port ${localPort}\n`);
            await new Promise(r => setTimeout(r, 2000)); // stabilise
        } catch (err) {
            console.error('❌ SSH tunnel failed:', err.message);
            process.exit(1);
        }
    }

    // ─── Connect to MySQL ─────────────────────────────────────────────────────
    const connection = await mysql.createConnection({
        host: useTunnel ? '127.0.0.1' : (process.env.DB_HOST || 'localhost'),
        port: useTunnel ? localPort : (parseInt(process.env.DB_PORT) || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true,
        connectTimeout: 30000,
    });

    console.log('✅ MySQL connected.\n');

    // ─── Run schema ───────────────────────────────────────────────────────────
    const schemaPath = path.join(__dirname, 'complete_schema.sql');

    if (!fs.existsSync(schemaPath)) {
        console.error(`❌ Schema file not found: ${schemaPath}`);
        process.exit(1);
    }

    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📦 Applying complete_schema.sql ...');
    try {
        await connection.query(sql);
        console.log('✅ Schema applied successfully!\n');
    } catch (err) {
        console.error('❌ Schema error:', err.message);
        await connection.end();
        process.exit(1);
    }

    // ─── Verify tables ────────────────────────────────────────────────────────
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.log('📋 Tables in database:');
    tableNames.forEach(t => console.log(`   ✔  ${t}`));

    // ─── Quick row counts ─────────────────────────────────────────────────────
    const checkTables = ['users', 'hotels', 'rooms', 'properties', 'bookings', 'payments', 'amenities'];
    console.log('\n📊 Row counts:');
    for (const t of checkTables) {
        if (tableNames.includes(t)) {
            const [[{ cnt }]] = await connection.query(`SELECT COUNT(*) AS cnt FROM \`${t}\``);
            console.log(`   ${t}: ${cnt} row(s)`);
        }
    }

    console.log('\n🎉 Database setup complete!\n');
    await connection.end();
    process.exit(0);
}

run().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
