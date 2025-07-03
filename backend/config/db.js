import mysql from 'mysql2/promise';
import * as DOTENV from '../utils/dotEnv.js';
import { schema } from '../utils/schema.js';

let pool;

const ensureDbExists = async () => {
  const connection = await mysql.createConnection({
    host: DOTENV.DB_HOST,
    port: DOTENV.DB_PORT,
    user: DOTENV.DB_USER,
    password: DOTENV.DB_PASS,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DOTENV.DB_NAME}\`;`);
  await connection.end();
};

const connectDB = async () => {
  try {
    await ensureDbExists();
    // Create a connection pool
    pool = mysql.createPool({
      host: DOTENV.DB_HOST,
      port: DOTENV.DB_PORT,
      user: DOTENV.DB_USER,
      password: DOTENV.DB_PASS,
      database: DOTENV.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    // Test the connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    console.log('Connected to MySQL DB...');
  } catch (error) {
    console.error('DB connection error: ', error);
  }
};

const createTable = async () => {
  const conn = await pool.getConnection();
  try {
    // Execute each SQL statement separately
    for (const sql of schema) {
      await conn.query(sql);
    }
    console.log('Database tables ensured.');
  } catch (error) {
    console.error('Error ceating DB tables: ', error.message);
  } finally {
    conn.release();
  }
};

export { pool as db, connectDB, createTable };
