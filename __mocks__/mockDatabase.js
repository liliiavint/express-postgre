const mockPool = require('./db.js')
  
  // Mock database functions
  const mockDatabase = {
    query: jest.fn().mockImplementation(async (sql, values) => {
      if (sql.startsWith('SELECT * FROM users')) {
        return { rows: mockPool.query().then(result => result.users) };
      } else if (sql.startsWith('SELECT * FROM transactions')) {
        return { rows: mockPool.query().then(result => result.transactions) };
      }
      throw new Error('Database error');
    }),
    insert: jest.fn().mockImplementation(async (table, values) => {
      mockPool[table].push(values);
      return { rows: [values] }; 
    }),
    delete: jest.fn().mockImplementation(async (table, condition) => {
      const index = mockPool[table].findIndex(row => row.transaction_id === condition.transaction_id);
      if (index !== -1) {
        const deletedTransaction = mockPool[table].splice(index, 1);
        return { rows: deletedTransaction }; 
      } else {
        return { rows: [] }; 
      }
    }),
  };
  
  module.exports = mockDatabase;