const ejs = require("ejs")

const displayChangeInfoUser = {
    changeInfoUser: (req, res) => {

        let alertMessagePass
        let successMessagePass
        let alertMessageInfo
        let successMessageInfo

        res.writeHead(200, { 'Content-Type': 'text/html' })

        // str = vue compilée avec les données
        ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
            res.end(str)
        })
    }
}

module.exports = displayChangeInfoUser