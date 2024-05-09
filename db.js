import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo-database',
  password: 'Postgres',
  port: 5432,
});

module.exports = pool;