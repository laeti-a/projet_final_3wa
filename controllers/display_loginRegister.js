const ejs = require("ejs")

const displayLoginRegister = {
    loginRegister: (req, res) => {

        let deleteSuccess = ""
        let alertSubmitMessage = ""
        let alertRegisterMessage = ""
        let successRegisterMessage = ""

        res.writeHead(200, { 'Content-Type': 'text/html' })

        // str = vue compilée avec les données
        ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage, alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
            res.end(str)
        })
    },


}

module.exports = displayLoginRegister