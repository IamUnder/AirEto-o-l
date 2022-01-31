// Importamos los modulos 
const mongoose = require('mongoose')

// Definimos el modelo
const numSchema = mongoose.Schema({
    value: {
        type: Number,
        required: true
    },
    primitiva: {
        type: Number,
        required: true
    },
    bonoloto: {
        type: Number,
        required: true
    },
    euromillon: {
        type: Number,
        required: true
    }
},{
    versionKey: false
})

// Exportamos el modelo
module.exports = mongoose.model('Num', numSchema)