require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));

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
  const { url } = req.query;

  try {
    if (url) {
      const [rows] = await pool.query('SELECT * FROM pages WHERE url = ?', [url]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Page not found' });
      }
      res.json(rows[0]);
    } else {
        const [rows] = await pool.query('SELECT * FROM pages');
      res.json(rows);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
