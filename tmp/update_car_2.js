const http = require('http');

const updateData = JSON.stringify({
    owner_name: 'Ismail Somstay',
    owner_phone: '+252-907123456',
    owner_email: 'ismail@somstay.so',
    rating: '4.8',
    reviews_count: 12
});

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/v1/cars/2',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': updateData.length
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(updateData);
req.end();
