const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPaths = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env')
];
for (const p of envPaths) {
  dotenv.config({ path: p });
}

const poolConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'college_erp',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Create the connection pool
const pool = mysql.createPool(poolConfig);

/**
 * Execute a parameterized SQL query safely
 * @param {string} sql Parameterized query string
 * @param {Array} params Parameter values
 * @returns {Promise<[Array, Object]>}
 */
async function query(sql, params = []) {
  return pool.execute(sql, params);
}

/**
 * Check if the database connection is alive
 * @returns {Promise<{ connected: boolean, message: string }>}
 */
async function checkDbConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return { connected: true, message: 'MySQL connection established successfully.' };
  } catch (err) {
    return {
      connected: false,
      message: `Database connection unavailable: ${err.message}. (Review database/README.md to setup schema).`
    };
  }
}

module.exports = {
  pool,
  query,
  checkDbConnection
};
