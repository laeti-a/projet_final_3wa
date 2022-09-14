const config = require('../tools/database')
const bcrypt = require('bcrypt')
const ejs = require("ejs")
const xss = require("xss")

const deleteAccountController = {
    getDeleteAccount: (req, res) => {
        let alertMessage

        res.writeHead(200, { 'Content-Type': 'text/html' })

        // str = vue compilée avec les données
        ejs.renderFile('./views/deleteAccount.ejs', { alertMessage }, {}, (err, str) => {
            res.end(str)
        })
    },

    submitDeleteAccount: (req, res) => {
        const confirm_password = req.body.confirm_password

        // Check field is not empty
        if(confirm_password){

            // Clean input before using it
            const cleanedCurrentPassword = xss(confirm_password)

            // Get id and password in session of current user
            let idCurrentUser = req.session.user.id
            let passwordCurrentUser = req.session.user.password

            // Compare password input and password in DB
            bcrypt.compare(cleanedCurrentPassword, passwordCurrentUser, (err, result) => {
                if(result){

                    // Delete user where id equal current session's user's id
                    let sqlQuery = "DELETE FROM user WHERE id = ?"
                    let value = [idCurrentUser]
                    config.query(sqlQuery, value, (err, result) => {
                        if(err) throw err

                        req.session.destroy(() => {
                            let alertSubmitMessage
                            let alertRegisterMessage
                            let successRegisterMessage
                            let deleteSuccess = "Votre compte a bien été supprimé !"

                            ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage, alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
                                res.end(str)
                            })
                        })
                    })
                }
                else{
                    let alertMessage = "Votre mot de passe est incorrect"

                    // str = vue compilée avec les données
                    ejs.renderFile('./views/deleteAccount.ejs', { alertMessage }, {}, (err, str) => {
                        res.end(str)
                    })
                }
            })
        }
        else{
            let alertMessage = "Veuillez renseigner votre mot de passe"

            // str = vue compilée avec les données
            ejs.renderFile('./views/deleteAccount.ejs', { alertMessage }, {}, (err, str) => {
                res.end(str)
            })
        }
    }
}

module.exports = deleteAccountController