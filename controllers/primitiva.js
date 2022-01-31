// Importacion de modulos
const config = require('nodemon/lib/config');
const puppeteer = require('puppeteer');

// Importacion de modelos
const Config = require('../models/config');
const Num = require('../models/num');

// Funcion get
get = ( req, res ) => {
    
    // Comprobamos si el valor de esta semana existe, si no lo generamos


}

// Funcion save con scraping web
save = async (req, res) => {

    // Obtenemos los ultimos valores
    const valuesRaw = await rawData(process.env.PRIMITIVAURL)

    var values = valuesRaw.join(' - ')
    
    // Comprobamos si ya se ha cargado el valor
    var config = await Config.findOne({ id: process.env.IDPRIMITIVA, value: values })
    if (!config) {

        await Config.findOneAndUpdate({
            id: process.env.IDPRIMITIVA
        },{
            value: values,
            date: Date.now()
        }).exec()

        // Guardamos los valores con aparicion
        var valuesArray = values.split(' - ')
        
        valuesArray.forEach( async element => {

            await Num.findOneAndUpdate({
                value: parseInt(element)
            },{
                $inc:{
                    primitiva: 1
                }
            })
        });

        return res.json({
            mensaje: values
        })
    
    }


    return res.json({
        mensaje: values,
        data: 'Los datos ya estaban guardados.'
    })

}

// Funcion para conseguir el raw
async function rawData (url) {

    try {
        // Abrimos una instancia del puppeteer y accedemos a la url
        const browser = await puppeteer.launch({
            //headless: false,
            //slowMo: 1000
        })
        const page = await browser.newPage()
        await page.goto(url)

        //Obtenemos los numeros
        const valoresRaw = await page.$eval(process.env.CLASSPRIMITIVA, numeros => numeros.textContent);
        var valores = []

        // Tratamos los valores
        for (let index = 0; index < 16; index+=2) {
            let temp = valoresRaw[index] + valoresRaw[index+1]
            valores.push(temp)
        }

        browser.close()

    } catch (error) {
        console.log(error);
    }

    // Devolvemos los valores
    return valores

}

// Exportacion de modulos
module.exports = {
    get,
    save
}