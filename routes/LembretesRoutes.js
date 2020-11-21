const express = require('express');
const router = express.Router();
const Lembrete = require('../models/Lembrete');
const moment = require('moment');

router.get('/', (req, res, next) => {
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

router.get('/:id', (req, res, next) => {
    Lembrete.findById(req.params.id)
        .then((result) => {
            if (result) {
                res.status(200).json(result);
            } else {
                ///* Caso seja 'result' == null, mande 404
                res.status(404).json({
                    msg: `registro ${req.params.id} não encontrado`,
                });
            }
        })
        .catch((err) => {
            console.error('\n=== ERRO DE CONSULTA ===\n', err);
            res.status(500).json({ msg: 'erro ao consultar o banco de dados' });
        });
});

router.post('/', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
    ///* "lembreteNovo" representa os novos dados que o cliente cedseja inserir no banco de dados
    const lembreteNovo = {
        conteudo: req.body.conteudo,
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

router.delete('/:id', (req, res, next) => {
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
            res.status(500).json({
                msg: `erro ao deletar registro ${req.params.id}`,
            });
        });
});

module.exports = router;