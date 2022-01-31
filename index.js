// Importacion de modulos
const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

// Inicializacion express
const app = express()

// Evitar problema de cors
app.use(cors())

// Capturar bodu
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

// Conexion DB
//const url = `mongodb://${process.env.USERDB}:${process.env.PASSWORDDB}@${process.env.URL}/${process.env.DBNAME}?retryWrites=true&w=majority`
const url = `mongodb://${process.env.URL}/${process.env.DBNAME}?retryWrites=true&w=majority`
mongoose.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then( () => console.log('Base de datos contectada') )
.catch( e => console.log('Error en la conexion: ', e) )

// Importacion de rutas
const primitiva = require('./routes/primitiva')

// Middleware
app.get('/', (req, res) => {
    res.json({
        error: false,
        mensaje: 'Works!'
    })
})

app.use('/primitiva', primitiva)

// Inicializacion server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`)
})