// Declaracion de modulos
const router = require('express').Router()

// Declaracion de controller
const init = require('../controllers/init')

// Rutas
router.get('/c', init.initC) // Ruta de inicializacion de configuracion
router.get('/n', init.initN) // Ruta de inicializacion de numeros


module.exports = router