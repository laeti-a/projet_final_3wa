const ejs = require("ejs")
const config = require('../tools/database')
const ShoppingCart = require('../models/Cart')

const displayCart = {
    displayCart: (req, res) => {

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

        let cart = ShoppingCart.getCart()

        res.writeHead(200, { 'Content-Type': 'text/html' })

        // str = vue compilée avec les données
        ejs.renderFile('./views/cart.ejs', { loggedin, isAdmin, cart }, {}, (err, str) => {
            res.end(str)
        })
        
    }
}

module.exports = displayCart