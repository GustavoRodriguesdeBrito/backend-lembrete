const express = require('express');
const mongoose = require('mongoose');
///* inicialização de variávies do ambiente
const dotenv = require('dotenv');
const result = dotenv.config({ path: './config/config.env' });
if (result.error) throw result.error; ///! o sistema não pode prosseguir sem essas variáveis
console.log('=== variáveis do ambiente carregadas ===\n', result.parsed);

const app = express();
app.use(express.json()); ///* body parser
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
    Lembrete.find()
        .then((lembretes) => {
            ///* A maneira com a qual o frontend interpreta os dados requer que eles sejam enviados em um vetor sem chaves no json
            ///* similar a "let lembretes = [{lembr1},{lembr2}...];"
            res.status(200).json(lembretes);
        })
        .catch((err) => {
            console.error('\n=== ERRO DE CONSULTA ===\n', err);
            res.status(500).json({
                msg: 'erro ao consultar o banco de dados',
            });
        });
});

app.post('/lembrete', (req, res, next) => {
    const lembrete = new Lembrete({
        conteudo: req.body.conteudo,
        ///* As datas precisam estar no formato 'yyyy-mm-dd'/ISO
        dataCriado: moment().utc(true).toDate(), ///* inserir data de modificação mantendo a hora local
        prazoFinal: req.body.prazoFinal,
        arquivado: req.body.arquivado,
        prioridade: req.body.prioridade,
    });
    lembrete
        .save()
        .then((lembreteCadastrado) => {
            res.status(201).json(lembreteCadastrado);
        })
        .catch((err) => {
            console.error('=== ERRO DE CADASTRO ===\n', err);
            res.status(500).json({ msg: 'erro ao cadastrar' });
        });
});

app.put('/lembrete/:id', (req, res, next) => {
    ///* "lembreteNovo" representa os novos dados que o cliente cedseja inserir no banco de dados
    const lembreteNovo = {
        conteudo: req.body.conteudo,
        dataCriado: req.body.dataCriado,
        prazoFinal: req.body.prazoFinal,
        arquivado: req.body.arquivado,
        prioridade: req.body.prioridade,
        modificado: moment().utc(true).toDate(), ///* inserir data de modificação mantendo a hora local
    };
    Lembrete.updateOne({ _id: req.params.id }, lembreteNovo)
        .then((result) => {
            if (result.n === 0) {
                res.status(404).json({
                    msg: `registro ${req.params.id} não encontrado`,
                });
            } else {
                res.status(200).json({
                    msg: `registro ${req.params.id} atualizado`,
                });
            }
        })
        .catch((err) => {
            console.error('=== ERRO AO ALTERAR ===\n', err);
            res.send(500).json({
                msg: `erro ao alterar registro ${req.params.id}`,
            });
        });
});

app.delete('/lembrete/:id', (req, res, next) => {
    Lembrete.deleteOne({ _id: req.params.id })
        .then((result) => {
            ///* "result.n" guarda a quantidade de registros deletados.
            ///* Se for 0, significa que nenhum registro foi deletado.
            if (result.n === 0) {
                res.status(404).json({
                    msg: `registro ${req.params.id} não encontrado`,
                });
            } else {
                res.status(200).json({
                    msg: `registro ${req.params.id} deletado`,
                });
            }
        })
        .catch((err) => {
            console.error('=== ERRO AO DELETAR ===\n', err);
            res.send(500).json({
                msg: `erro ao deletar registro ${req.params.id}`,
            });
        });
});

module.exports = app;
