require('dotenv').config(); // Loads the .env file
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001; // Uses the port defined in .env or defaults to 3001

// Database configuration using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware for JSON parsing
app.use(express.json());

// Route to list data from the `pages` table
app.get('/pages', async (req, res) => {
  const { url } = req.query; // Captures the `url` parameter from the query string

  try {
    if (url) {
      // Query to fetch a specific page by `url`
      const [rows] = await pool.query('SELECT * FROM pages WHERE url = ?', [url]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Page not found' }); // Returns 404 if not found
      }
      res.json(rows[0]); // Returns the data of the found page
    } else {
      // Query to list all pages if `url` is not provided
      const [rows] = await pool.query('SELECT * FROM pages');
      res.json(rows);
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Returns the error in case of failure
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
