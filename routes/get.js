// Declaracion de modulos
const router = require('express').Router()

// Declaracion de controller
const get = require('../controllers/get')



// Rutas
router.get('/now', get.get) // Ruta para obtener las predicciones de esta semana
router.get('/price', get.price) // Ruta para obtener los premios de esta semana
router.get('/price/last', get.priceLastWeek) // Ruta para obtener los premios de la semana pasada
router.get('/price/:week', get.priceWeek) // Ruta para obtener los premios de una semana determinada

// Exportacion de modulos
module.exports = router