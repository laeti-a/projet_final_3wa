const config = require('../tools/database')
const bcrypt = require('bcrypt')
const ejs = require("ejs")
const xss = require("xss")

const submitForms = {
    submitFormLogin: (req, res) => {
        const { login_email, login_password } = req.body 

        // Check fields are not empty
        if(login_email && login_password){

            // Clean inputs before using them
            const cleanedEmail = xss(login_email)
            const cleanedPassword = xss(login_password)

            // Check if the user exists in the database
            let sqlQuery = "SELECT * FROM user WHERE email = ?"
            config.query(sqlQuery, [cleanedEmail], (err, result) => {
                if(err) throw err

                if(result.length == 0){
                    let deleteSuccess
                    let alertRegisterMessage
                    let successRegisterMessage
                    let alertSubmitMessage = "Email ou mot de passe incorrect !"

                    ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage, alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
                        res.end(str)
                    })
                }
                else{
                    let userData = result[0]
                    let password = result[0].password
                    let nameUser = result[0].firstName
                    let isAdmin = result[0].isAdmin

                    // Compare password input and password in DB
                    bcrypt.compare(cleanedPassword, password, (err, result) => {
                        if(result){
                            req.session.loggedIn = true
                            req.session.user = userData

                            if(isAdmin == true){
                                req.session.isAdmin = true

                                let successLogin = `Vous êtes bien connecté en tant qu'Admin !`

                                ejs.renderFile('./views/myaccount_admin.ejs', { successLogin}, {}, (err, str) => {
                                    res.end(str)
                                })
                            }
                            else{
                                req.session.isAdmin = false
                                
                                let successLoginMessage = `Vous êtes bien connecté. Bon retour parmi nous ${nameUser} ;)`

                                ejs.renderFile('./views/myaccount.ejs', { successLoginMessage }, {}, (err, str) => {
                                    res.end(str)
                                })
                            }
                        }
                        else{
                            let deleteSuccess
                            let alertRegisterMessage
                            let successRegisterMessage
                            let alertSubmitMessage = "Email ou mot de passe incorrect !"

                            ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage, alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
                                res.end(str)
                            })
                        }
                    })
                }
            })
        }
        else {
            let deleteSuccess
            let alertRegisterMessage
            let successRegisterMessage
            let alertSubmitMessage = "Merci de bien vouloir remplir tous les champs !"

            ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage, alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
                res.end(str)
            })
        }
    },

    submitFormRegister: (req, res) => {
        const {register_lastname, register_firstname, register_email, register_password, register_confirm_password} = req.body

        // Check fields are not empty
        if(register_lastname && register_firstname && register_email && register_password && register_confirm_password){

            // Clean inputs before using them
            const cleanedLastName = xss(register_lastname)
            const cleanedFirstName = xss(register_firstname)
            const cleanedEmail = xss(register_email)
            const cleanedPassword = xss(register_password)
            const cleanedPassConfirm = xss(register_confirm_password)

            // Check if the user already exists or not
            let sqlQueryCheck = "SELECT * FROM user WHERE email = ?"
            config.query(sqlQueryCheck, [cleanedEmail], (err, result) => {
                if(err) throw err

                if(result.length >= 1){
                    let deleteSuccess
                    let alertSubmitMessage
                    let successRegisterMessage
                    let alertRegisterMessage = "Cette adresse mail est déjà utilisée"

                    ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage,alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
                        res.end(str)
                    })
                }
                // Check email
                else if(!register_email.includes('@') || !register_email.includes('.') || register_email.includes('`') || register_email.includes(`"`) || register_email.includes(`'`) || register_email.includes('>') || register_email.includes('<') || register_email.includes('/') || register_email.length > 254){
                    let deleteSuccess
                    let alertSubmitMessage
                    let successRegisterMessage
                    let alertRegisterMessage = "Adresse mail invalide"

                    ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage,alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
                        res.end(str)
                    })
                }
                // Check password length
                else if(register_password.length < 8 || register_password.length > 20){
                    let deleteSuccess
                    let alertSubmitMessage
                    let successRegisterMessage
                    let alertRegisterMessage = "Votre mot de passe doit contenir entre minimum 8 et maximum 20 caractères"

                    ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage,alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
                        res.end(str)
                    })
                }
                // Check if password fields match
                else if(cleanedPassword != cleanedPassConfirm){
                    let deleteSuccess
                    let alertSubmitMessage
                    let successRegisterMessage
                    let alertRegisterMessage = "Veuillez entrer un mot de passe identique"

                    ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage,alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
                        res.end(str)
                    })
                }
                else{
                    let hashPass = bcrypt.hashSync(cleanedPassword, 6)

                    req.session.loggedIn = true
                    
                    let values = [cleanedFirstName, cleanedLastName, cleanedEmail, hashPass]
                    let sqlQueryAdd = "INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)"
                    
                    // Add new user to DB
                    config.query(sqlQueryAdd, values, (err) => {
                        if(err) throw err

                        let deleteSuccess
                        let alertSubmitMessage
                        let alertRegisterMessage
                        let successRegisterMessage = "Votre compte a bien été créé ! Vous pouvez maintenant vous connecter"

                        ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage,alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
                            res.end(str)
                        })
                    })
                }
            })
        }
        else{
            let deleteSuccess
            let alertSubmitMessage
            let successRegisterMessage
            let alertRegisterMessage = "Veuillez renseigner tous les champs pour pouvoir vous inscrire"

            ejs.renderFile('./views/loginRegister.ejs', { deleteSuccess, alertSubmitMessage, alertRegisterMessage, successRegisterMessage }, {}, (err, str) => {
                res.end(str)
            })
        }
    }
}

module.exports = submitForms