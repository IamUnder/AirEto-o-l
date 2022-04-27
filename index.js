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
var url = ''
if (process.env.URL) {
    url = `mongodb://${process.env.URL}/${process.env.DBNAME}?retryWrites=true&w=majority`
} else {
    url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@airetol.m24hl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
}
mongoose.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then( () => console.log('Base de datos contectada') )
.catch( e => console.log('Error en la conexion: ', e) )

// Importacion de rutas
const primitiva = require('./routes/primitiva')
const bonoloto = require('./routes/bonoloto')
const euromillon = require('./routes/euromillon')
const init = require('./routes/init')
const get = require('./routes/get')

// Middleware
app.get('/', (req, res) => {
    res.json({
        error: false,
        mensaje: 'Works!'
    })
})

app.use('/primitiva', primitiva)
app.use('/bonoloto', bonoloto)
app.use('/euromillon', euromillon)
app.use('/init', init)
app.use('/get', get)

// Inicializacion server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`)
})