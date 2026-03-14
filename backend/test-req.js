fetch('http://localhost:9050/api/v1/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"user_id": 12, "entity_type": "Room", "entity_id": 53, "check_in": "2026-03-14", "check_out": "2026-03-15", "total_price": 180, "status": "Confirmed", "payment_status": "Paid"})
}).then(res => res.json()).then(console.log).catch(console.error);
