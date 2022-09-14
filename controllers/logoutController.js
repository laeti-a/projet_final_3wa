const ShoppingCart = require('../models/Cart')

const logoutController = {
    logout: (req, res) => {

        ShoppingCart.emptyCart()

        req.session.destroy(() => {
            res.redirect('/loginRegister')
        })
    }
}

module.exports = logoutController