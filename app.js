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

// Rota principal para listar os dados da tabela `paginas`
app.get('/', async (req, res) => {
  try {
    // Consulta para selecionar todos os dados da tabela `paginas`
    const [rows] = await pool.query('SELECT * FROM pages');
    res.json(rows); // Retorna os dados como JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna o erro em caso de falha
  }
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
