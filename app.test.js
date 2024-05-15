
// const app = require('./app.js');
// const supertest = require('supertest');


// describe('POST /transactions', () => {
//   it('should create a new transaction', async () => {
//     const newTransaction = {
//         amount: 4000000,
//         userFrom: "Karl",
//         userTo: "Henry"
//     };
//     const response = await supertest(app)
//       .post('/transactions')
//       .send(newTransaction);
//     expect(response.statusCode).toBe(201); 
//     expect(response.body)
//     .toHaveProperty("message", "Transaction created successfully"); // Assuming the response includes an ID
//   }); 
// });

// describe('POST /transactions', () => {
//   it('should return 400 for missing required fields', async () => {
//     const invalidTransaction = {};
//     const response = await supertest(app)
//       .post('/transactions')
//       .send(invalidTransaction);
//     expect(response.statusCode).toBe(400); 
//     expect(response.body).toHaveProperty('errors.amount', 'This field is required');
//     expect(response.body).toHaveProperty('errors.userFrom', 'This field is required');
//     expect(response.body).toHaveProperty('errors.userTo', 'This field is required');
//     expect(response.body).toHaveProperty('message', 'Validation errors');
//     });
//   });
 
// describe('GET /transactions', () => {
//   it('should return a list of transactions', async () => {
//     const response = await supertest(app).get('/transactions');
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBeInstanceOf(Object); 
//   });
// });

// describe('GET /users', () => {
//   it('should return a list of users', async () => {
//     const response = await supertest(app).get('/users');
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBeInstanceOf(Object); 
//   });
// });

// // const mockDatabase = require('./__mock__/mockDatabase');

// // describe('GET /transactions', () => {
// //   afterEach(() => {
// //     jest.clearAllMocks();
// //   });

// //   // Replace mockQuery with mockDatabase.query
// //   it('should return transactions when query is successful', async () => {
// //     const response = await supertest(app).get('/transactions');
// //     expect(response.status).toBe(200);
// //     expect(response.body).toBeInstanceOf(Object); 
    
// //   });
// // });

// //   describe('GET /users', () => {
// //     afterEach(() => {
// //       jest.clearAllMocks();
// //     });
// //   it('should return users when query is successful', async () => {
// //     const response = await supertest(app).get('/users');
// //     expect(response.status).toBe(200);
// //     expect(response.body).toBeInstanceOf(Object); 
    
// // });
// // });


// // describe('GET /transactions', () => {
// //   test('responds with JSON message', async () => {
// //         const response = await supertest(app).get('/transactions');
// //         expect(response.statusCode).toBe(200);
// //         expect(response.body.length).toEqual(20);
// //     });
// //   });