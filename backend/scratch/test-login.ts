import request from 'supertest';

async function main() {
  try {
    const response = await request('http://localhost:3001')
      .post('/api/auth/login')
      .send({
        identifier: 'muscabaxmed762@gmail.com',
        password: 'password123'
      });
    console.log('Login Response Status:', response.status);
    console.log('Login Response Body:', JSON.stringify(response.body, null, 2));
  } catch (error: any) {
    console.error('Login Failed:', error.message);
  }
}

main();
