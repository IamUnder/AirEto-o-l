// Importacion de modulos
const primitiva = require('../routes/primitiva')
const bonoloto = require('../routes/bonoloto')
const euromillon = require('../routes/euromillon')

// Importamos los modelos
const generate = require('../models/generate')

// Funciones de devolver lo generado de esa semana
get = async ( req, res ) => {

    // id1 = primitiva, id2 = bonoloto, id3 = euromillon
    const primitiva = await generate.find({ id: process.env.IDPRIMITIVA }).sort([['week', -1]]).limit(1)
    const bonoloto = await generate.find({ id: process.env.IDBONOLOTO }).sort([['week', -1]]).limit(1)
    const euromillon = await generate.find({ id: process.env.IDEUROMILLON }).sort([['week', -1]]).limit(1)

    return res.json({
        primitiva: primitiva[0].value,
        primtiva_week: primitiva[0].week,
        bonoloto: bonoloto[0].value,
        bonoloto_week: bonoloto[0].week,
        euromillon: euromillon[0].value,
        euromillon_week: euromillon[0].week
    })
}



module.exports = {
    get
}