// Declaracion de modulos
const router = require('express').Router()

// Declaracion de controller
const primitiva = require('../controllers/primitiva')

// Rutas 
router.get('/get', primitiva.get) // Ruta de obtencion del resultado
router.get('/save', primitiva.save) // Ruta para la carga de valores


//Exportacion de modulos
module.exports = router