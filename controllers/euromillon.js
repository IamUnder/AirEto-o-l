// Importacion de modelos
const Config = require('../models/config');
const Num = require('../models/num');
const Generate = require('../models/generate');
const Acierto = require('../models/acierto')
const puppeteer = require('puppeteer');

// Funcion get
get = async ( req, res ) => {
    
    // Comprobamos si el valor de esta semana existe, si no lo generamos
    const generate = await Generate.findOne({ id: process.env.IDEUROMILLON , week: getWeek()})

    if (!generate) { // Si no existe generamos

        let more = await Num.find({}).sort([['euromillon', -1]]).limit(20).exec()
        var result = []
        var final = []

        more.forEach(element => {
            result.push(element.value)
        })

        // Formacion Array
        var index = 0
        // Parte numeros mas usados
        while (index < 3) {
            let aux = result[Math.floor(Math.random()*result.length)]
            if (!final.includes(aux)) {
                final.push(aux)
                index++
            }
        }
        // Parte numeros menos usados
        index = 0
        while (index < 2) {
            let aux = Math.floor(Math.random() * (50 - 1) + 1)
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

        // Añadimos los dos valores de estrellas 
        let moreStar = await Num.find({value: {$lte: 12}}).sort([['estrella', -1]]).limit(6).exec()

        for (let index = 0; index < 2; index++) {
            let aux = moreStar[Math.floor(Math.random()*moreStar.length)]
            final.push(aux.value)
        }

        // Guardamos el valor
        const generate = new Generate({
            id: process.env.IDEUROMILLON,
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

    res.json({
        mensaje: generate.value
    })

}

// Funcion save con scraping web
save = async (req, res) => {

    // Obtenemos los ultimos valores
    const valuesRaw = await rawData(process.env.EUROMILLONURL)

    var values = valuesRaw.join(' - ')
    
    // Comprobamos si ya se ha cargado el valor
    var config = await Config.findOne({ id: process.env.IDEUROMILLON, value: values })
    if (!config) {

        await Config.findOneAndUpdate({
            id: process.env.IDEUROMILLON
        },{
            value: values,
            date: Date.now()
        }).exec()

        // Guardamos los valores con aparicion
        var valuesArray = values.split(' - ')

        // Comprobamos los valores con los de esa semana para ver si hay premio
        var generate = await Generate.find({ id: process.env.IDEUROMILLON }).sort([['week', -1]]).limit(1)
        var generateValues = generate[0].value.split(' - ')
        var premio = []
        // Comprobamos si hay premio
        for (let i = 0; i < generateValues.length; i++) {
            if (valuesArray.includes(generateValues[i])) {
                premio.push(true)
            } else {
                premio.push(false)
            }
        }
        
        // Guardamos los resultados en la base de datos
        var acierto = new Acierto({
            resultado: valuesArray.join(' - '),
            apuesta: generateValues.join(' - '),
            premio: premio.join(' - '),
            id: process.env.IDEUROMILLON,
            week: getWeek(),
        }).save()

        for (let index = 0; index < (valuesArray.length - 2); index++) {

            await Num.findOneAndUpdate({
                value: parseInt(valuesArray[index])
            },{
                $inc:{
                    euromillon: 1
                }
            })

        }

        for (let index = (valuesArray.length - 2); index < valuesArray.length; index++) {

            await Num.findOneAndUpdate({
                value: parseInt(valuesArray[index])
            },{
                $inc:{
                    estrella: 1
                }
            })
            
        }

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
                euromillon: 1
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
        const valoresRaw = await page.$eval(process.env.CLASSEUROMILLON, numeros => numeros.textContent)

        // Tratamos los valores
        var valores = []
        valores = valoresRaw.replace(/ /g,'') // Quitamos el array
        valores = valores.split('\n') // Quitamos los saltos de linea
        valores = valores.splice(3,7) // Quitamos los valores que no soy necesarios

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