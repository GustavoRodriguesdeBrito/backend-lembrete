const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.post('/cadastro', (req, res, next) => {
    const usuario = new Usuario({ nome: req.body.nome, senha: req.body.senha });
    usuario
        .save()
        .then((usuarioCadastrado) => {
            res.status(201).json({ msg: 'cadastro realizado' });
        })
        .catch((err) => {
            console.error('=== ERRO DE CADASTRO ===\n', err);
            res.status(500).json({ msg: 'erro ao cadastrar' });
        });
});

router.post('/login', (req, res, next) => {
    Usuario.findOne({ nome: req.body.nome, senha: req.body.senha })
        .then((result) => {
            ///* se 'result' for null = usuario não encontrado
            if (result) {
                res.status(200).json(result._id);
            } else {
                res.status(404).json({ msg: 'usuario não encontrado' });
            }
        })
        .catch((err) => {
            console.error('=== ERRO DE LOGIN ===\n', err);
            res.status(500).json({ msg: 'erro de login' });
        });
});

module.exports = router;
