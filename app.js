require('dotenv').config(); // Carrega o arquivo .env
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001; // Usa a porta definida no .env ou padrão 3001

// Configuração do banco de dados usando variáveis de ambiente
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

// Middleware para JSON
app.use(express.json());

// Rota de teste
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT "API está funcionando!" AS message');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
