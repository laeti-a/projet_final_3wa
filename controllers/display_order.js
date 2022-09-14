const ejs = require("ejs")
const config = require('../tools/database')

const displayOrder = {
    displayOrder: (req, res) => {

        let loggedin
        if(req.session.loggedIn){
            loggedin = req.session.loggedIn
        }
        else{
            loggedin = false
        }

        let isAdmin
        if(req.session.isAdmin){
            isAdmin = req.session.isAdmin
        }
        else{
            isAdmin = false
        }

        config.query("SELECT * FROM meal", (err, result) => {
            if(err) throw err

            let meals = Object.values(JSON.parse(JSON.stringify(result)))

            res.writeHead(200, { 'Content-Type': 'text/html' })

            // str = vue compilée avec les données
            ejs.renderFile('./views/order.ejs', { meals, loggedin, isAdmin }, {}, (err, str) => {
                res.end(str)
            })
        })
    }
}

module.exports = displayOrder