// Declaracion de modulos
const router = require('express').Router()

// Declaracion de controller
const euromillon = require('../controllers/euromillon')

// Declaracion de modelos
const Config = require('../models/config')
const Num = require('../models/num')

// Rutas 
router.get('/test', euromillon.rawData) // Ruta de testing
router.get('/get', euromillon.get) // Ruta de obtencion del resultado
router.get('/save', euromillon.save) // Ruta para la carga de valores
router.post('/post', euromillon.post) // Ruta para la carga de valores antiguos
router.get('/init', async (req, res) => { // Ruta de inicializacion de la config 

    // Validamos que no se haya provocado el init ya
    const isConfigExist = await Config.findOne({ id: process.env.IDEUROMILLON })
    if (isConfigExist) {
        return res.status(400).json({
            error: 'Init ya ejecutado.',
            mensaje: 'Init ya ejecutado.'
        })
    }

    const config = new Config({
        id: process.env.IDEUROMILLON,
        descripcion: 'Ultimo sorteo recogido euromillon',
        value: '0'
    })

    try {
        
        const savedConfig = await config.save()
        res.json({
            mensaje: 'Inializacion correcta.'
        })

    } catch (error) {
        res.status(400).json({
            error: error
        })
    }

})
router.get('/initN', async (req, res) => { // Ruta de inicializacion de los numeros

    const isNumsExist = await Config.findOne({ value: 1 })
    if (isNumsExist) {
        return res.status(400).json({
            error: 'Init ya ejecutado.',
            mensaje: 'Init ya ejecutado.'
        })
    }

    for (let index = 1; index < 51; index++) {
       let num = new Num({
           value: index,
           primitiva: 0,
           bonoloto: 0,
           euromillon: 0,
           estrella: 0
       })

       num.save()
    }

    res.json({
        mensaje: 'Inicializacion correcta.'
    })

})


//Exportacion de modulos
module.exports = router