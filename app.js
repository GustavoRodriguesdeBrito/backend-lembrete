const express = require('express');
const mongoose = require('mongoose');
const app = express();
///* acionar o body parser do express
app.use(express.json());
const jwt = require('jsonwebtoken');
///* importação das rotas de cada entidade
const rotasLembrete = require('./routes/LembretesRoutes');
const rotasUsuario = require('./routes/UsuarioRoutes');

///* inicialização de variávies do ambiente
const dotenv = require('dotenv');
const result = dotenv.config({ path: './config/config.env' });
if (result.error) throw result.error; ///! o sistema não pode prosseguir sem essas variáveis
console.log('=== variáveis do ambiente carregadas ===\n', result.parsed);

///*estabelecer conexão com o servidor do MongoDB
mongoose
    .connect(process.env.MONGODB_CON_STR, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('conexão com MongoDB Atlas estabelecida');
    })
    .catch((err) => {
        console.error('=== ERRO MONGODB ===\n', err);
    });


///* inserir headers na mensagem de resposta
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    ///* se o header 'Authorization' está sendo enviado, uma 'pre-flight request' é acionada,
    ///* que não tem o token, causando problemas
    if(req.method === "OPTIONS") {
        //console.log("options triggered", req.headers);
        res.sendStatus(200);
    } else {
        ///* passe adiante caso não seja uma request de método OPTIONS
        next();
    }
});

app.use('/lembrete', rotasLembrete);
app.use('/usuario', rotasUsuario);

module.exports = app;
