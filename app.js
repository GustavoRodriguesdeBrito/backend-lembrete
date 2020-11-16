const express = require('express');
const mongoose = require('mongoose');
///* inicialização de variávies do ambiente
const dotenv = require('dotenv');
const result = dotenv.config({path:'./config/config.env'});
if(result.error) throw result.error; ///! o sistema não pode prosseguir sem essas variáveis
console.log("=== variáveis do ambiente carregadas ===\n",result.parsed);

const app = express();
app.use(express.json()); ///* body parser
mongoose
    .connect(
        process.env.MONGODB_CON_STR,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        console.log('conexão com MongoDB Atlas estabelecida');
    })
    .catch((err) => {
        console.error('=== ERRO MONGODB ===\n', err);
    });

const Lembrete = require('./models/Lembrete');
const moment = require('moment');

///* inserir headers na mensagem de resposta
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
        console.log("lembretes antes da conversão de datas: \n", lembretes);
        let arrLembs = []; //* criação de array que vai guardar os dados reformatados
        lembretes.map((lembrete)=>{
            console.log(lembrete);
            let lembObj = lembrete.toObject();
            //* A função utcOffset serve para ajustar o fuso horário, sendo usado aqui para impedir que haja
            //* alguma mudança no dia por conta do fuso horário brasileiro
            lembObj.dataCriado = moment(lembrete.dataCriado).utcOffset(0).format("DD/MM/YYYY");
            lembObj.prazoFinal = moment(lembrete.prazoFinal).utcOffset(0).format("DD/MM/YYYY");
            arrLembs = [...arrLembs,lembObj];
        });
        console.log("lembretes depois da conversão de datas: \n" ,arrLembs);
        ///* A maneira com a qual o frontend interpreta os dados requer que eles sejam enviados em um vetor sem chaves no json
        ///* similar a "let lembretes = [{lembr1},{lembr2}...];"
        res.status(200).json(arrLembs);
    })
    .catch((err) => {
        console.error("\n=== ERRO ===\n", err);
        res.status(500).json({msg:"problemas ao consultar o banco de dados"});
    });
});

app.post('/lembrete', (req, res, next) => {
    const lembrete = new Lembrete({
        conteudo: req.body.conteudo,
        //converter as datas do formato 'dd/mm/yyyy' para o formato 'yyyy-mm-dd'
        dataCriado: moment(req.body.dataCriado, "DD/MM/YYYY").parseZone().toDate().toISOString(),
        prazoFinal: moment(req.body.prazoFinal, "DD/MM/YYYY").parseZone().toDate().toISOString(),
        arquivado: req.body.arquivado,
        prioridade: req.body.prioridade
    });
    lembrete.save()
    .then((lembreteCadastrado) => {
        console.log("Cadastrando item: ", lembreteCadastrado);
        res.status(201).json(lembreteCadastrado);
    })
    .catch((err) => {
        console.error("=== ERRO DE CADASTRO ===\n", err);
        res.status(500).json({msg:'erro de cadastro'});
    });
});

app.put('/lembrete/:id', (req, res, next) => {});

app.delete('/lembrete/:id', (req, res, next) => {});

module.exports = app;
