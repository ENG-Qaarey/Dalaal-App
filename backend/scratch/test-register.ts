import request from 'supertest';

async function main() {
  try {
    const response = await request('http://localhost:3001')
      .post('/api/auth/register')
      .send({
        email: 'muscabaxmed762@gmail.com',
        password: 'password123',
        fullName: 'Muscab Axmed',
        phone: '617777777'
      });
    console.log('Register Response Status:', response.status);
    console.log('Register Response Body:', JSON.stringify(response.body, null, 2));
  } catch (error: any) {
    console.error('Register Failed:', error.message);
  }
}

main();
