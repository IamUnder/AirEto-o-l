

// Importacion de modelos
const Config = require('../models/config');
const Num = require('../models/num');
const Generate = require('../models/generate');
const puppeteer = require('puppeteer');
const res = require('express/lib/response');

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
            headless: true,
            args: ['--no-sandbox','--disable-setuid-sandbox']
        })
        const page = await browser.newPage()
        await page.goto(url)

        //Obtenemos los numeros
        const valoresRaw = await page.$eval(process.env.CLASSPRIMITIVA, numeros => numeros.textContent)

        // Tratamos los valores
        var valores = []
        valores = valoresRaw.replace(/ /g,'') // Quitamos el array
        valores = valores.split('\n') // Quitamos los saltos de linea
        valores = valores.splice(1,8) // Quitamos los valores que no soy necesarios
        
        console.log(valores);

        browser.close()

    } catch (error) {
        console.log(error);
    }

    // Devolvemos los valores
     return valores
    
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

test = async (req, res) => {

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1920,1080',
            '--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"'
        ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
    await page.setJavaScriptEnabled(true)
    await page.goto(process.env.PRIMITIVAURL)
    console.log(page.isJavaScriptEnabled());

    await page.screenshot().then(function(buffer) {
        res.setHeader('Content-Disposition', 'attachment;filename=test.png');
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer)
    });

    await browser.close();
}

// Exportacion de modulos
module.exports = {
    get,
    save,
    post,
    test,
    rawData
}