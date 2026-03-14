async function test() {
   try {
      const res = await fetch('http://localhost:9050/api/v1/bookings/my-bookings?userId=12');
      const data = await res.json();
      console.log('Bookings:', JSON.stringify(data, null, 2));
   } catch(e) {
      console.log('Error:', e.message);
   }
}
test();
