const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

router.post('/cadastro', (req, res, next) => {
    const usuario = new Usuario({ nome: req.body.nome, senha: req.body.senha });
    usuario
        .save()
        .then((usuarioCadastrado) => {
            res.status(201).json({ msg: 'cadastro realizado' });
        })
        .catch((err) => {
            console.error('=== ERRO DE CADASTRO ===\n', err);
            if (err.code === 11000) {
                res.status(400).json({ msg: 'nome de usuário já cadastrado' });
            } else {
                res.status(500).json({ msg: 'erro ao cadastrar' });
            }
        });
});

router.post('/login', (req, res, next) => {
    Usuario.findOne({ nome: req.body.nome, senha: req.body.senha })
        .then((user) => {
            ///* se 'user' for null = usuario não encontrado
            if (user) {
                let token = jwt.sign(
                    { nome: user.nome, id: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' } ///* token é válido por 1 hora
                );
                res.status(200).json({ token, nome: user.nome });
            } else {
                res.status(400).json({
                    msg: 'usuario e/ou senha incorretos',
                });
            }
        })
        .catch((err) => {
            console.error('=== ERRO DE LOGIN ===\n', err);
            res.status(500).json({ msg: 'erro de login' });
        });
});

module.exports = router;
