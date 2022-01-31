// Importacion de modulos

// Funcion get
get = ( req, res ) => {
    
    const currentDay = new Date().getDay()

    if (currentDay == 1) {  // Si es lunes ( currentDay = 1 ) comprueba si esta generado.
        
        return res.json({
            data: 'Hoy es lunes hay que comprobar'
        })

    } else { // Si no es lunes ( currentDay != 1 ) solo lo muestra.
        
        return res.json({
            data: 'Hay que mostar el valor acumulado'
        })

    }

}

// Funcion save con scraping web
save = ( req, res) => {

    return res.json({
        data: 'save'
    })

}

// Exportacion de modulos
module.exports = {
    get,
    save
}