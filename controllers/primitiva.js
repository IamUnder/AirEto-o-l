// Importacion de modulos
const config = require('nodemon/lib/config');
const puppeteer = require('puppeteer');

// Importacion de modelos
const Config = require('../models/config');
const Num = require('../models/num');
const Generate = require('../models/generate');

// Funcion get
get = async ( req, res ) => {
    
    // Comprobamos si el valor de esta semana existe, si no lo generamos
    const generate = await Generate.findOne({ id: process.env.IDPRIMITIVA , week: getWeek()})

    if (!generate) { // Si no existe generamos

        let more = await Num.find({}).sort([['primitiva', -1]]).limit(20).exec()
        var result = []
        var final = []

        more.forEach(element => {
            result.push(element.value)
        })

        // Formacion Array
        var index = 0
        // Parte numeros mas usados
        while (index < 4) {
            let aux = result[Math.floor(Math.random()*result.length)]
            if (!final.includes(aux)) {
                final.push(aux)
                index++
            }
        }
        // Parte numeros menos usados
        index = 0
        while (index < 2) {
            let aux = Math.floor(Math.random() * (49 - 1) + 1)
            if (!result.includes(aux)) {
                if (!final.includes(aux)) {
                    final.push(aux)
                    index++
                }
            }
        }
        // Ordenamos el array 
        final.sort(function(a, b) {
            return a - b;
        });

        // Guardamos el valor
        const generate = new Generate({
            id: process.env.IDPRIMITIVA,
            week: getWeek(),
            value: final.join(' - ')
        })

        try {
            
            const savedGenerate = await generate.save()
            return res.json({
                mensaje: final.join(' - '),
                data: 'Generacion correcta.'
            })

        } catch (error) {

            return res.status(400).json({
                error: error
            })

        }

    }

    console.log(generate);

    res.json({
        mensaje: generate.value
    })

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

post = async (req, res) => {

    // Guardamos los valores con aparicion
    var valuesArray = req.body.value.split(' - ')
        
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
        mensaje: 'Inserccion correcta.'
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

// Funcion para conseguir la semana
getWeek = () => {

    currentdate = new Date();
    var oneJan = new Date(currentdate.getFullYear(),0,1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);

    return result

}

// Exportacion de modulos
module.exports = {
    get,
    save,
    post
}