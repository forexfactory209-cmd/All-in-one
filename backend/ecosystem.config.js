module.exports = {
    apps: [
        {
            name: 'somstay-backend',
            script: 'src/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: 9050,
                USE_SSH_TUNNEL: 'false',
                DB_HOST: '127.0.0.1',
                DB_PORT: 3306,
                DB_USER: 'duc_user',
                DB_PASS: 'Ducaysane@2026!System',
                DB_NAME: 'hotel_app',
                REDIS_HOST: '127.0.0.1',
                REDIS_PORT: 6379,
                JWT_SECRET: 'somstay_super_secret_key_2026',
                JWT_EXPIRES_IN: '7d'
            },
            watch: false,
            max_memory_restart: '1G',
            error_file: 'logs/pm2-error.log',
            out_file: 'logs/pm2-out.log',
            merge_logs: true,
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
        },
    ],
};
