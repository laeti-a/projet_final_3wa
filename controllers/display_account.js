const ejs = require("ejs")

const displayMyaccount = {
    myaccount: (req, res) => {

        let successLoginMessage = ""

        res.writeHead(200, { 'Content-Type': 'text/html' })

        // str = vue compilée avec les données
        ejs.renderFile('./views/myaccount.ejs', {successLoginMessage}, {}, (err, str) => {
            res.end(str)
        })
    }
}

module.exports = displayMyaccount