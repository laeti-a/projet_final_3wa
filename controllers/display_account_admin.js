const ejs = require("ejs")

const displayAccountAdmin = {
    accountAdmin: (req, res) => {
        let successLogin = ""

        res.writeHead(200, { 'Content-Type': 'text/html' })

        // str = vue compilée avec les données
        ejs.renderFile('./views/myaccount_admin.ejs', { successLogin }, {}, (err, str) => {
            res.end(str)
        })
    }
}

module.exports = displayAccountAdmin