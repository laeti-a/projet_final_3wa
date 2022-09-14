const config = require('../tools/database')
const ejs = require("ejs")
const bcrypt = require("bcrypt")
const xss = require("xss")

const submitChangeMenu = {
    submitAddMeal: (req, res) => {
        const { name_meal, image_meal, description_meal, price_meal } = req.body

        if(name_meal && image_meal && description_meal && price_meal){

            // Clean inputs before using them
            const cleanedNameMeal = xss(name_meal)
            const cleanedDescriptionMeal = xss(description_meal)

            let sqlQuery = "INSERT INTO meal (nameMeal, photo, description, price) VALUES (?, ?, ?, ?)"
            let values = [cleanedNameMeal, image_meal, cleanedDescriptionMeal, price_meal]
            config.query(sqlQuery, values, (err, result) => {
                if(err) throw err
            })
        }
    },

    submitDeleteMeal: (req, res) => {
        const { list_meals, access_password } = req.body

        if(list_meals && access_password){

            // Clean inputs before using them
            const cleanedPassword = xss(access_password)

            // Get password in session of current user
            let passwordCurrentUser = req.session.user.password

            // Compare password input and password in DB
            bcrypt.compare(cleanedPassword, passwordCurrentUser, (err, result) => {
                if(result){

                    // Delete meal where id equal select value
                    let sqlQuerySearch = "DELETE FROM meal WHERE id = ?"
                    config.query(sqlQuerySearch, [list_meals], (err, result) => {
                        if(err) throw err

                        let alertDeleteMeal 
                        let alertUpdateMeal
                        let successDeleteMeal = "Le suppression du plat a bien été effectuée"
                        let successUpdateMeal

                        config.query("SELECT * FROM meal", (err, result) => {
                            if(err) throw err

                            let meals = Object.values(JSON.parse(JSON.stringify(result)))

                            res.writeHead(200, { 'Content-Type': 'text/html' })

                            // str = vue compilée avec les données
                            ejs.renderFile('./views/changeMenu.ejs', { meals, alertDeleteMeal, alertUpdateMeal, successDeleteMeal, successUpdateMeal }, {}, (err, str) => {
                                res.end(str)
                            })
                        })
                    })
                }
                else{
                    let alertDeleteMeal = "Votre mot de passe est incorrect"
                    let alertUpdateMeal
                    let successDeleteMeal
                    let successUpdateMeal

                    config.query("SELECT * FROM meal", (err, result) => {
                        if(err) throw err

                        let meals = Object.values(JSON.parse(JSON.stringify(result)))

                        res.writeHead(200, { 'Content-Type': 'text/html' })

                        // str = vue compilée avec les données
                        ejs.renderFile('./views/changeMenu.ejs', { meals, alertDeleteMeal, alertUpdateMeal, successDeleteMeal, successUpdateMeal }, {}, (err, str) => {
                            res.end(str)
                        })
                    })
                }
            })
        }
        else{
            let alertDeleteMeal = "Merci de bien vouloir renseigner tous les champs"
            let alertUpdateMeal
            let successDeleteMeal
            let successUpdateMeal

            config.query("SELECT * FROM meal", (err, result) => {
                if(err) throw err

                let meals = Object.values(JSON.parse(JSON.stringify(result)))

                res.writeHead(200, { 'Content-Type': 'text/html' })

                // str = vue compilée avec les données
                ejs.renderFile('./views/changeMenu.ejs', { meals, alertDeleteMeal, alertUpdateMeal, successDeleteMeal, successUpdateMeal }, {}, (err, str) => {
                    res.end(str)
                })
            })
        }
        
    },

    submitUpdateMeal: (req, res) => {
        const { list_meals, update_name_meal, update_description_meal, update_price_meal } = req.body

        // If all inputs are completed
        if(list_meals && update_name_meal && update_description_meal && update_price_meal){

            // Clean inputs before using them
            const cleanedName = xss(update_name_meal)
            const cleanedDescription = xss(update_description_meal)

            let sqlQuery = "UPDATE meal SET nameMeal = ?, description = ?, price = ? WHERE id = ?"
            let values = [cleanedName, cleanedDescription, update_price_meal, list_meals]
            config.query(sqlQuery, values, (err, result) => {
                if(err) throw err

                let alertDeleteMeal
                let alertUpdateMeal
                let successDeleteMeal
                let successUpdateMeal = "Les informations du plat ont bien été modifiées"
    
                config.query("SELECT * FROM meal", (err, result) => {
                    if(err) throw err
    
                    let meals = Object.values(JSON.parse(JSON.stringify(result)))
    
                    res.writeHead(200, { 'Content-Type': 'text/html' })
    
                    // str = vue compilée avec les données
                    ejs.renderFile('./views/changeMenu.ejs', { meals, alertDeleteMeal, alertUpdateMeal, successDeleteMeal, successUpdateMeal }, {}, (err, str) => {
                        res.end(str)
                    })
                })
            })
        }
        // If only name meal input is completed
        else if(list_meals && update_name_meal && !update_description_meal && !update_price_meal){

            // Clean input before using it
            const cleanedName = xss(update_name_meal)

            let sqlQuery = "UPDATE meal SET nameMeal = ? WHERE id = ?"
            let values = [cleanedName, list_meals]
            config.query(sqlQuery, values, (err, result) => {
                if(err) throw err

                let alertDeleteMeal
                let alertUpdateMeal
                let successDeleteMeal
                let successUpdateMeal = "Le nom du plat a bien été modifié"
    
                config.query("SELECT * FROM meal", (err, result) => {
                    if(err) throw err
    
                    let meals = Object.values(JSON.parse(JSON.stringify(result)))
    
                    res.writeHead(200, { 'Content-Type': 'text/html' })
    
                    // str = vue compilée avec les données
                    ejs.renderFile('./views/changeMenu.ejs', { meals, alertDeleteMeal, alertUpdateMeal, successDeleteMeal, successUpdateMeal }, {}, (err, str) => {
                        res.end(str)
                    })
                })
            })
        }
        // If only description meal input is completed
        else if(list_meals && !update_name_meal && update_description_meal && !update_price_meal){

            // Clean input before using it
            const cleanedDescription = xss(update_description_meal)

            let sqlQuery = "UPDATE meal SET description = ? WHERE id = ?"
            let values = [cleanedDescription, list_meals]
            config.query(sqlQuery, values, (err, result) => {
                if(err) throw err

                let alertDeleteMeal
                let alertUpdateMeal
                let successDeleteMeal
                let successUpdateMeal = "La description du plat a bien été modifiée"
    
                config.query("SELECT * FROM meal", (err, result) => {
                    if(err) throw err
    
                    let meals = Object.values(JSON.parse(JSON.stringify(result)))
    
                    res.writeHead(200, { 'Content-Type': 'text/html' })
    
                    // str = vue compilée avec les données
                    ejs.renderFile('./views/changeMenu.ejs', { meals, alertDeleteMeal, alertUpdateMeal, successDeleteMeal, successUpdateMeal }, {}, (err, str) => {
                        res.end(str)
                    })
                })
            })
        }
        // If only price meal input is completed
        else if(list_meals && !update_name_meal && !update_description_meal && update_price_meal){
            
            let sqlQuery = "UPDATE meal SET price = ? WHERE id = ?"
            let values = [update_price_meal, list_meals]
            config.query(sqlQuery, values, (err, result) => {
                if(err) throw err

                let alertDeleteMeal
                let alertUpdateMeal
                let successDeleteMeal
                let successUpdateMeal = "Le prix du plat a bien été modifié"
    
                config.query("SELECT * FROM meal", (err, result) => {
                    if(err) throw err
    
                    let meals = Object.values(JSON.parse(JSON.stringify(result)))
    
                    res.writeHead(200, { 'Content-Type': 'text/html' })
    
                    // str = vue compilée avec les données
                    ejs.renderFile('./views/changeMenu.ejs', { meals, alertDeleteMeal, alertUpdateMeal, successDeleteMeal, successUpdateMeal }, {}, (err, str) => {
                        res.end(str)
                    })
                })
            })
        }
        else{
            let alertDeleteMeal
            let alertUpdateMeal = "Merci de bien vouloir renseigner le/les champ/s que vous souhaitez modifier"
            let successDeleteMeal
            let successUpdateMeal

            config.query("SELECT * FROM meal", (err, result) => {
                if(err) throw err

                let meals = Object.values(JSON.parse(JSON.stringify(result)))

                res.writeHead(200, { 'Content-Type': 'text/html' })

                // str = vue compilée avec les données
                ejs.renderFile('./views/changeMenu.ejs', { meals, alertDeleteMeal, alertUpdateMeal, successDeleteMeal, successUpdateMeal }, {}, (err, str) => {
                    res.end(str)
                })
            })
        }
    },

    submitUploadImage: (req, res) => {
        const { id_meal, name_new_image } = req.body

        if(id_meal && name_new_image){

            let sqlQuery = "UPDATE meal SET photo = ? WHERE id = ?"
            let values = [name_new_image, id_meal]
            config.query(sqlQuery, values, (err, result) => {
                if(err) throw err
            })
        }
    },
}

module.exports = submitChangeMenu