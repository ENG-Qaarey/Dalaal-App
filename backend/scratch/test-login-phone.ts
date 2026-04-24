import request from 'supertest';

async function main() {
  try {
    const response = await request('http://localhost:3001')
      .post('/api/auth/login')
      .send({
        identifier: '614463895',
        password: 'password123' // I don't know the password, but let's see if it finds the user
      });
    console.log('Login Response Status:', response.status);
    console.log('Login Response Body:', JSON.stringify(response.body, null, 2));
  } catch (error: any) {
    console.error('Login Failed:', error.message);
  }
}

main();
