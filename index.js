import express, { json } from 'express';
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
    userfrom: { type: String, required: true },
    userto: { type: String, required: true },
  };
  
  // Function to validate user data against schema
  function validateUser(userData) {
    const errors = {};
    Object.keys(userSchema).forEach((field) => {
      if (!userData[field]) {
        errors[field] = 'This field is required';
      }
    });
    return errors;
  }
  
  // Function to validate transaction data against schema
  function validateTransaction(transactionData) {
    const errors = {};
    Object.keys(transactionSchema).forEach((field) => {
      if (!transactionData[field]) {
        errors[field] = 'This field is required';
      }
    });
    return errors;
  }
  

// Create a new user (POST /users)
app.post('/user', async (req, res) => {
   console.log(req.body); 
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

  // Create a new transaction (POST /transactions)carsRouter.post('/create', async (req, res) => {
    
  app.post('/transactions', async (req, res) => {
    const transactionData = req.body;
    const validationErrors = validateTransaction(transactionData);
  
    if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors: validationErrors });
    }
  
    let client;

    try {
        client = await pool.connect();
        await client.query('BEGIN'); // Start transaction

        // Check if userFrom and userTo exist
        const userFromResult = await client.query('SELECT * FROM users WHERE name = $1', [transactionData.userfrom]);
        const userToResult = await client.query('SELECT * FROM users WHERE name = $1', [transactionData.userto]);

        if (userFromResult.rows.length === 0 || userToResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'User(sine) do not exist' });
        }

        const result = await client.query('INSERT INTO transactions (amount, userfrom, userto) VALUES ($1, $2, $3) RETURNING *', [
            transactionData.amount,
            userFromResult.rows[0].name,
            userToResult.rows[0].name,
        ]);
        const newTransaction = result.rows[0];

        await client.query('COMMIT'); // Commit transaction
        res.status(201).json(newTransaction);
    } catch (err) {
        console.error('Error creating transaction:', err);
        // Roll back the transaction if one was started
        if (client) {
            try {
                await client.query('ROLLBACK');
            } catch (rollbackError) {
                console.error('Error rolling back transaction:', rollbackError);
            }
        }
        res.status(500).json({ message: 'Error creating transaction' });
    } finally {
        if (client) { // Release the connection even on error
            client.release();
        }
    }
});
// Get all transactions (GET /transactions)
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

