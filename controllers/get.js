// Importacion de modulos
const primitiva = require('../routes/primitiva')
const bonoloto = require('../routes/bonoloto')
const euromillon = require('../routes/euromillon')

// Importamos los modelos
const generate = require('../models/generate')
const acierto = require('../models/acierto')

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

// Funcion para devolver los premios de la ultima semana
price = async ( req, res ) => {

    // id1 = primitiva, id2 = bonoloto, id3 = euromillon
    const primitiva = await acierto.find({ id: process.env.IDPRIMITIVA, week: getWeek() })
    const bonoloto = await acierto.find({ id: process.env.IDBONOLOTO, week: getWeek() })
    const euromillon = await acierto.find({ id: process.env.IDEUROMILLON, week: getWeek() })

    return res.json({
        primitiva: primitiva[0] ?? null,
        bonoloto: bonoloto[0] ?? null,
        euromillon: euromillon[0] ?? null
    })

}

// Funcion para devolver los premios de la semana pasada
priceLastWeek = async ( req, res ) => {

    // id1 = primitiva, id2 = bonoloto, id3 = euromillon
    const primitiva = await acierto.find({ id: process.env.IDPRIMITIVA, week: getWeek() - 1})
    const bonoloto = await acierto.find({ id: process.env.IDBONOLOTO, week: getWeek() - 1 })
    const euromillon = await acierto.find({ id: process.env.IDEUROMILLON, week: getWeek() - 1 })

    return res.json({
        primitiva: primitiva[0] ?? null,
        bonoloto: bonoloto[0] ?? null,
        euromillon: euromillon[0] ?? null
    })

}

// Funcion para devolver los premios de esta semana
priceWeek = async ( req, res ) => {

    const week = req.params.week

    // id1 = primitiva, id2 = bonoloto, id3 = euromillon
    const primitiva = await acierto.find({ id: process.env.IDPRIMITIVA, week: week })
    const bonoloto = await acierto.find({ id: process.env.IDBONOLOTO, week: week })
    const euromillon = await acierto.find({ id: process.env.IDEUROMILLON, week: week })

    return res.json({
        primitiva: primitiva ?? null,
        bonoloto: bonoloto ?? null,
        euromillon: euromillon ?? null
    })
}

// Funcion para conseguir la semana
getWeek = () => {

    currentdate = new Date()
    var oneJan = new Date(currentdate.getFullYear(),0,1)
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000))
    var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7)

    if (currentdate.getDay() > 0 && currentdate.getDay() < 3) {
        result++
    }

    return result

}


module.exports = {
    get, 
    price,
    priceLastWeek,
    priceWeek
}