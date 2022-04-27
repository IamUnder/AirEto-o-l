// Imporacion de modelos
const Config = require('../models/config')
const Num = require('../models/num')

// Ruta de inicio de configuracion
initC = async ( req, res ) => {

    // Validamos que no se haya provocado el init ya
    const isConfigExist = await Config.findOne({ id: process.env.IDPRIMITIVA })
    if (isConfigExist) {
        return res.status(400).json({
            error: 'Init ya ejecutado.',
            mensaje: 'Init ya ejecutado.'
        })
    }

    const configPrimitiva = new Config({
        id: process.env.IDPRIMITIVA,
        descripcion: 'Ultimo sorteo recogido',
        value: '0'
    })

    const configBonoloto = new Config({
        id: process.env.IDBONOLOTO,
        descripcion: 'Ultimo sorteo recogido',
        value: '0'
    })

    const configEuromillon = new Config({
        id: process.env.IDEUROMILLON,
        descripcion: 'Ultimo sorteo recogido',
        value: '0'
    })

    try {
        
        const savedConfigPrimitiva = await configPrimitiva.save()
        const savedConfigBonoloto = await configBonoloto.save()
        const savedConfigEuromillon = await configEuromillon.save()
        res.json({
            mensaje: 'Inializacion correcta.'
        })

    } catch (error) {
        
        res.status(400).json({
            error: error
        })

    }

}

// Ruta de inicio de numeros
initN = async ( req, res ) => {

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
}

// Exportacion de modulos
module.exports = {
    initC,
    initN
}