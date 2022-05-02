// Importamos los modulos 
const mongoose = require('mongoose')

// Definimos el modelo
const aciertoSchema = mongoose.Schema({
    resultado: {
        type: String,
        required: true
    },
    apuesta: {
        type: String,
        required: true
    },
    premio: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    week: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
})

// Exportamos el modelo
module.exports = mongoose.model('Acierto', aciertoSchema)