// Importamos los modulos 
const mongoose = require('mongoose')

// Definimos el modelo
const generateSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    week: {
        type: Number,
        required: true
    },
    value: {
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
module.exports = mongoose.model('Generate', generateSchema)