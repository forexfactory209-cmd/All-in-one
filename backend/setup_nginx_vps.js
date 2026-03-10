const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    const nginxConfig = `server {
    listen 8080;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection '"upgrade"';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}`;
    
    // Create a temporary file and then move it with sudo
    conn.exec(`cat > /tmp/somstay_backend && echo "Abc123@@" | sudo -S mv /tmp/somstay_backend /etc/nginx/sites-available/somstay_backend && echo "Abc123@@" | sudo -S ln -sf /etc/nginx/sites-available/somstay_backend /etc/nginx/sites-enabled/ && echo "Abc123@@" | sudo -S systemctl restart nginx`, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
        stream.write(nginxConfig);
        stream.end();
    });
}).connect({
    host: '206.183.129.220',
    port: 22,
    username: 'mohamoud',
    password: 'Abc123@@'
});
