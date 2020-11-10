const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); /// body parser
mongoose
    .connect(
        'mongodb+srv://gustavo:6s4JSZpJ9WehbCHb@cluster0.hnsxl.mongodb.net/projeto_a3?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        console.log('conexão com MongoDB Atlas estabelecida');
    })
    .catch((err) => {
        console.error('=== ERRO MONGODB ===\n', err);
    });

const Lembrete = require('./models/Lembrete');

/// inserir headers na mensagem de resposta
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
});

app.get('/lembrete', (req, res, next) => {
    Lembrete.find().then((lembretes) => {
      console.log("lembretes: \n", lembretes);
      //* A maneira com a qual o frontend interpreta os dados requer que eles sejam enviados em um vetor sem chaves no json
      //* similar a "let lembretes = [{lembr1},{lembr2}...];"
      res.status(200).json(lembretes);
    })
    .catch((err) => {
      console.error("\n=== ERRO ===\n", err);
      res.status(500).json({msg:"problemas ao consultar o banco de dados"});
    });
});

app.post('/lembrete', (req, res, next) => {});

app.put('/lembrete/:id', (req, res, next) => {});

app.delete('/lembrete/:id', (req, res, next) => {});

module.exports = app;
