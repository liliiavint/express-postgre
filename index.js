import express from 'express';

const app = express();

// Parse incoming JSON data
app.use(express.json());

const userSchema = {
    name: { type: String, required: true },
  };

  // Transaction Schema (for validation)
const transactionSchema = {
    amount: { type: Number, required: true },
    userFrom: { type: String, required: true },
    userTo: { type: String, required: true },
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
app.post('/users', async (req, res) => {
    const userData = req.body;
    const validationErrors = validateUser(userData);
  
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ message: 'Validation errors', errors: validationErrors });
    }
  
    try {
      const client = await pool.connect();
      const result = await client.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [userData.name]);
      const newUser = result.rows[0];
      await client.release();
      res.status(201).json(newUser);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Error creating user' });
    }
  });

  // Create a new transaction (POST /transactions)
app.post('/transactions', async (req, res) => {
    const transactionData = req.body;
    const validationErrors = validateTransaction(transactionData);
  
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ message: 'Validation errors', errors: validationErrors });
    }
  
    try {
      const client = await pool.connect();
      await client.query('BEGIN'); // Start transaction
  
      // Check if userFrom and userTo exist
      const userFromResult = await client.query('SELECT * FROM users WHERE name = $1', [transactionData.userFrom]);
      const userToResult = await client.query('SELECT * FROM users WHERE name = $1', [transactionData.userTo]);
  
      if (userFromResult.rows.length === 0 || userToResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'User(s) do not exist' });
      }
  
      const result = await client.query('INSERT INTO transactions (amount, user_from, user_to) VALUES ($1, $2, $3) RETURNING *', [
        transactionData.amount,
        userFromResult.rows[0].id, // Use user ID instead of name
        userToResult.rows[0].id,
      ]);
      const newTransaction = result.rows[0];
  
      await client.query('COMMIT'); // Commit transaction
      await client.release();
      res.status(201).json(newTransaction);
    }catch (err) {
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
        await client.release(); // Release the connection even on error
      }
    })

// Get all transactions (GET /transactions)
app.get('/transactions', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM transactions');
    const transactions = result.rows;
    await client.release();
    res.json(transactions);
  } catch (err) {
    console.error('Error getting transactions:', err);
    res.status(500).json({ message: 'Error getting transactions' });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));