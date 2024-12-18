const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const session = require('express-session');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Carregar variáveis de ambiente
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use (express.static(path.join(__dirname,'../public')));

// Middleware para garantir que a resposta seja sempre JSON
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'seu_segredo',
        resave: false,
        saveUninitialized: true,
    })
);

// Configuração do banco de dados
const dbConfig = {
    host: 'mysql-aula.cuebxlhckhcy.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'mysqlaula',
    password: 'MySQLAula123!',
    database: 'mysqlaula',
};

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// Rota para autenticação (login)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM autenticacao WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const user = rows[0];

        if (user.password !== password) {
            return res.status(401).json({ message: 'Senha inválida' });
        }

        const permissions = user.permissions ? user.permissions.split(',').map((p) => p.trim()) : [];
        req.session.user = { id: user.id, username: user.username, role: user.role, permissions };

        const loginTime = new Date();
        await connection.execute(
            'INSERT INTO logins (username, login_time) VALUES (?, ?)',
            [username, loginTime]
        );

        await connection.end();
        res.json({ message: 'Login bem-sucedido!', role: user.role, permissions });
    } catch (error) {
        console.error('Erro ao autenticar:', error);
        res.status(500).json({ message: 'Erro ao autenticar', error: error.message });
    }
});

// Rota para cadastrar novos usuários
app.post('/register', async (req, res) => {
    console.log("Requisição de registro recebida"); // Log para verificar a requisição

    const { matricula, nome, senha } = req.body;

    // Valida os dados enviados na requisição
    if (!matricula || !nome || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Verifica se o usuário já existe no banco de dados
        const [existingUser] = await connection.execute(
            'SELECT * FROM autenticacao WHERE username = ?',
            [matricula]
        );

        if (existingUser.length > 0) {
            await connection.end();
            return res.status(409).json({ message: 'Usuário já existe.' });
        }

        // Insere o novo usuário no banco de dados
        await connection.execute(
            'INSERT INTO autenticacao (username, password, name) VALUES (?, ?, ?)',
            [matricula, senha, nome]
        );

        await connection.end();
        res.status(201).json({ message: 'Conta criada com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: error.message });
    }
});

// Rota para inserir dados na tabela Cadastro
app.post('/inserir_visita', async (req, res) => {
    const { solicitante, cliente, obra, segmento_regional, valor_estimado, informacoes_adicionais } = req.body;

    if (!solicitante || !cliente || !obra || !segmento_regional || !valor_estimado) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            `INSERT INTO cadastro (solicitante, cliente, obra, segmento_regional, valor_estimado, informacoes_adicionais)
            VALUES (?, ?, ?, ?, ?, ?)`, 

            [solicitante, cliente, obra, segmento_regional, valor_estimado, informacoes_adicionais]
        );

        await connection.end();
        res.json({ message: 'Cadastro inserido com sucesso!', result });
    } catch (error) {
        console.error('Erro ao inserir dados:', error);
        res.status(500).json({ message: 'Erro ao inserir dados no banco' });
    }
});

// Rota para buscar os dados de cadastro
app.get('/produtos', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute('SELECT * FROM Cadastro');
        await connection.end();
        res.json(results);
    } catch (error) {
        console.error('Erro ao consultar os dados:', error);
        res.status(500).json({ message: 'Erro ao consultar os dados' });
    }
});

// Middleware para tratar erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
