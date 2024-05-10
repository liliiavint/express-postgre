import express from 'express';
import { json } from 'express';
import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo-database',
  password: 'Postgres',
  port: 5432,
});

export default pool;

const app = express();
const port = 3000;
// Parse incoming JSON data
app.use(json());

app.get('/', (req, res) => {
  return res.send('Welcome TESTING')
});

const userSchema = {
    name: { type: String, required: true },
  };

  // Transaction Schema (for validation)
const transactionSchema = {
    amount: { type: Number, required: true },
    userFrom: { type: String, required: true },
    userTo: { type: String, required: true },
  };
  
  function validateUser(userData) {
    const errors = {};
    Object.keys(userSchema).forEach((field) => {
      if (!userData[field]) {
        errors[field] = 'This field is required';
      }
    });
    return errors;
  }

  function validateTransaction(transactionData) {
    const errors = {};
    Object.keys(transactionSchema).forEach((field) => {
      if (!transactionData[field]) {
        errors[field] = 'This field is required';
      }
    });
    return errors;
  }
  

app.post('/user', async (req, res) => {

    const userData = req.body;
    const validationErrors = validateUser(userData);
  
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ message: 'Validation errors', errors: validationErrors });
    }
  
    try {
      const client = await pool.connect();
      const result = await client.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [userData.name]);
      const newUser = result.rows[0];
      client.release();
      res.status(201).json(newUser);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Error creating user' });
    }
  });

    
  app.post('/transactions', async (req, res) => {
    let client; 
    
    try {
      client = await pool.connect(); 
      const { amount, userFrom, userTo } = req.body;
      const validationErrors = validateTransaction(req.body);
    
      if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors: validationErrors });
      }
  
      await client.query('BEGIN'); 
  
      const userFromResult = await client.query('SELECT id FROM users WHERE name ILIKE $1', [userFrom]);
      const userToResult = await client.query('SELECT id FROM users WHERE name ILIKE $1', [userTo]);
  
      const userFromId = userFromResult.rows[0]?.id;
      const userToId = userToResult.rows[0]?.id;
      console.log('User ID:', userToId);
      if (!userFromId || !userToId) {
        return res.status(404).json({ message: 'Sender or recipient not found' });
      }
  
      const result = await client.query('INSERT INTO transactions (amount, user_from, user_to) VALUES ($1, $2, $3) RETURNING *', [
        amount,
        userFromId,
        userToId,
      ]);
      
      await client.query('COMMIT'); 
      res.status(201).json({ message: 'Transaction created successfully' });
    } catch (error) {
      console.error(error);
      await client.query('ROLLBACK');
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      if (client) {
        client.release();
      }
    }
  });

app.get('/transactions', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM transactions');
    const transactions = result.rows;
    client.release();
    res.json(transactions);
  } catch (err) {
    console.error('Error getting transactions:', err);
    res.status(500).json({ message: 'Error getting transactions' });
  }
});

app.listen(port, () => {
  console.log(`URL: http://localhost:${port}`);
});

