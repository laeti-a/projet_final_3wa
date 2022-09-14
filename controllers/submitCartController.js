const ejs = require("ejs")
const config = require('../tools/database')
const ShoppingCart = require('../models/Cart')

const submitCartController = {
    addToCart: (req, res) => {
        const id_meal = req.body.id_meal

        let sqlQuery = "SELECT * FROM meal WHERE id = ?"
        config.query(sqlQuery, [id_meal], (err, result) => {
            if (err) throw err

            let meal = Object.values(JSON.parse(JSON.stringify(result)))

            ShoppingCart.save(meal[0])

            let cart = ShoppingCart.getCart()
            
            req.session.cart = cart

            res.redirect('/cart')
        })
    },

    deleteFromCart: (req, res) => {
        const mealId = req.body.meal_id

        ShoppingCart.delete(mealId)

        res.redirect('/cart')
    },

    emptyCart: (req, res) => {

        ShoppingCart.emptyCart()

        res.redirect('/cart')
    },

    checkout: (req, res) => {
        let idUser = req.session.user.id
        let loggedin = req.session.loggedIn
        let isAdmin = req.session.isAdmin

        ShoppingCart.checkout(idUser)

        ejs.renderFile('./views/checkout.ejs', { loggedin, isAdmin }, {}, (err, str) => {
            res.end(str)
        })
    }
}

module.exports = submitCartController