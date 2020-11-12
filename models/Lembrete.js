const mongoose = require('mongoose');

const lembreteSchema = mongoose.Schema({
    conteudo: { type: String, required: true },
    arquivado: { type: Boolean, required: true },
    prioridade: {
        type: String,
        enum: ['BAIXA', 'MEDIA', 'ALTA'],
        required: true,
    },
    modificado: { type: Date, required: false }, ///? é uma data de última modificação
    dataCriado: { type: Date, required: true },
    prazoFinal: { type: Date, required: true },
});

module.exports = mongoose.model('Lembrete', lembreteSchema);
