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

// Rota para listar todos os dados da tabela `paginas`
app.get('/pages', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pages');
    res.json(rows); // Retorna os dados como JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna o erro em caso de falha
  }
});

// Rota para buscar uma página pelo URL
app.get('/pages/:url', async (req, res) => {
  const { url } = req.params; // Captura o parâmetro `url` da rota
  try {
    // Consulta para selecionar a página correspondente ao `url`
    const [rows] = await pool.query('SELECT * FROM pages WHERE url = ?', [url]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Página não encontrada' }); // Retorna 404 se não encontrar
    }
    res.json(rows[0]); // Retorna os dados da página encontrada
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna o erro em caso de falha
  }
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
