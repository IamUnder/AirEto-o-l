// Declaracion de modulos
const router = require('express').Router()

// Declaracion de controller
const primitiva = require('../controllers/primitiva')

// Declaracion de modelos
const Config = require('../models/config')
const Num = require('../models/num')

// Rutas 
router.get('/test', primitiva.test) // Ruta de testing
router.get('/get', primitiva.get) // Ruta de obtencion del resultado
router.get('/save', primitiva.save) // Ruta para la carga de valores
router.post('/post', primitiva.post) // Ruta para la carga de valores antiguos
router.get('/init', async (req, res) => { // Ruta de inicializacion de la config 

    // Validamos que no se haya provocado el init ya
    const isConfigExist = await Config.findOne({ id: process.env.IDPRIMITIVA })
    if (isConfigExist) {
        return res.status(400).json({
            error: 'Init ya ejecutado.',
            mensaje: 'Init ya ejecutado.'
        })
    }

    const config = new Config({
        id: process.env.IDPRIMITIVA,
        descripcion: 'Ultimo sorteo recogido',
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
           euromillon: 0
       })

       num.save()
    }

    res.json({
        mensaje: 'Inicializacion correcta.'
    })

})


//Exportacion de modulos
module.exports = router