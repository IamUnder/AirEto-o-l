// Importamos los modulos 
const mongoose = require('mongoose')

// Definimos el modelo
const configSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
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
module.exports = mongoose.model('Config', configSchema)