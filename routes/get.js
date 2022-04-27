// Declaracion de modulos
const router = require('express').Router()

// Declaracion de controller
const get = require('../controllers/get')



// Rutas
router.get('/now', get.get) // Ruta de testing

// Exportacion de modulos
module.exports = router