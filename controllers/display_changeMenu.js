const config = require('../tools/database')
const ejs = require("ejs")

const displayChangeMenu = {
    changeMenu: (req, res) => {

        let alertDeleteMeal
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
}

module.exports = displayChangeMenu