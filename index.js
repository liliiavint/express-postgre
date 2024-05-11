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

app.use(json());

app.get('/', (req, res) => {
  return res.send('Welcome TESTING')
});

const userSchema = {
    name: { type: String, required: true },
  };

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
     const userFromResult = await client.query('SELECT id, name FROM users WHERE name ILIKE $1', [userFrom]);
     const userToResult = await client.query('SELECT id, name FROM users WHERE name ILIKE $1', [userTo]);

     const userFromId = userFromResult.rows[0]?.id;
     const userFromName = userFromResult.rows[0]?.name;
     const userToId = userToResult.rows[0]?.id;
     const userToName = userToResult.rows[0]?.name;
     
     if (!userFromId || !userToId) {
       return res.status(404).json({ message: 'Sender or recipient not found' });
     }

     await client.query('INSERT INTO transactions (amount, from_id, from_name, to_id, to_name) VALUES ($1, $2, $3, $4, $5) RETURNING *', [
      amount,
      userFromId,
      userFromName,
      userToId,
      userToName
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

app.delete('/transactions/:transactionId', async (req, res) => {
  let client = null;

  try {
    client = await pool.connect();
    const transactionId = req.params.transactionId; 
    await client.query('BEGIN');

    const deleteTransactionQuery = 'DELETE FROM transactions WHERE transaction_id = $1 RETURNING *';
    const { rows: deletedTransaction } = await client.query(deleteTransactionQuery, [transactionId]);

    if (deletedTransaction.length === 0) { 
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Transaction deleted successfully', transaction: deletedTransaction });
  } catch (error) {
    console.error(error);
    await client.query('ROLLBACK');
    client.end();
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (client) {
      client.release();
    }
  }
});
app.listen(port, () => {
  console.log(`URL: http://localhost:${port}`);
});

