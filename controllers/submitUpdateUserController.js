const config = require('../tools/database')
const bcrypt = require('bcrypt')
const ejs = require("ejs")
const xss = require("xss")

const updateSubmit = {
    submitPassword: (req, res) => {
        const { current_password, new_password, confirm_new_password } = req.body 

        // Check fields are not empty
        if(current_password && new_password && confirm_new_password){

            // Clean inputs before using them
            const cleanedCurrentPassword = xss(current_password)
            const cleanedNewPassword = xss(new_password)
            const cleanedConfirmPass = xss(confirm_new_password)

            // Get email and password in session of current user
            let emailCurrentUser = req.session.user.email
            let passwordCurrentUser = req.session.user.password
            
            // Compare password input and password in DB
            bcrypt.compare(cleanedCurrentPassword, passwordCurrentUser, (err, result) => {
                if(result){

                    if(new_password.length < 8 || new_password.length > 20){
                        let successMessagePass
                        let alertMessageInfo
                        let successMessageInfo
                        let alertMessagePass = "Votre nouveau mot de passe doit contenir entre minimum 8 et maximum 20 caractères"
                        
                        ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                            res.end(str)
                        })
                    }
                    else if(cleanedNewPassword != cleanedConfirmPass){
                        let successMessagePass
                        let alertMessageInfo
                        let successMessageInfo
                        let alertMessagePass = "Les champs du nouveau mot de passe ne correspondent pas"
                        
                        ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                            res.end(str)
                        })
                    }
                    else{
                        let hashNewPass = bcrypt.hashSync(cleanedNewPassword, 6)

                        let sqlQuery = "UPDATE user SET password = ? WHERE email = ?"
                        let values = [hashNewPass, emailCurrentUser]
                        config.query(sqlQuery, values, (err, result) => {
                            if(err) throw err

                            let alertMessagePass
                            let alertMessageInfo
                            let successMessageInfo
                            let successMessagePass = "Votre mot de passe a bien été modifié !"
                            
                            ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                                res.end(str)
                            })
                        })
                    }
                }
                else{
                    let successMessagePass
                    let alertMessageInfo
                    let successMessageInfo
                    let alertMessagePass = "Votre mot de passe actuel est incorrect"

                    ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                        res.end(str)
                    })
                }
            })
        }
        else{
            let successMessagePass
            let alertMessageInfo
            let successMessageInfo
            let alertMessagePass = "Merci de bien vouloir remplir tous les champs !"

            ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                res.end(str)
            })
        }
    },

    submitInformation: (req, res) => {
        const {birth_date, address_content, address_city, address_zip_code, address_country, phone_number, access_password} = req.body

        // If all inputs are completed (which means that the user wants to complete/change everything)
        if(birth_date && address_content && address_city && address_zip_code && address_country && phone_number && access_password){

            // Clean inputs before using them
            const cleanedAddressContent = xss(address_content)
            const cleanedAddressCity = xss(address_city)
            const cleanedAddressZipCode = xss(address_zip_code)
            const cleanedAddressCountry = xss(address_country)
            const cleanedPhoneNumber = xss(phone_number)
            const cleanedAccessPass = xss(access_password)

            // Get email and password in session of current user
            let emailCurrentUser = req.session.user.email
            let passwordCurrentUser = req.session.user.password

            let checkPhoneNumber = ifHaveLetters(phone_number)
            let checkZipCode = ifHaveLetters(address_zip_code)
            
            if(address_zip_code.length > 5 || address_zip_code.length < 5 || checkZipCode == true){
                let successMessagePass
                let alertMessagePass
                let successMessageInfo
                let alertMessageInfo = "Le code postal est invalide"

                ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                    res.end(str)
                })
            }
            // Check length of phone number and if it contains letter
            else if(phone_number.length > 10 || phone_number.length < 10 || checkPhoneNumber == true){
                let successMessagePass
                let alertMessagePass
                let successMessageInfo
                let alertMessageInfo = "Le numéro de téléphone renseigné est invalide (doit être au format suivant : 0611223344)"

                ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                    res.end(str)
                })
            }
            else{
                // Compare password input and password in DB
                bcrypt.compare(cleanedAccessPass, passwordCurrentUser, (err, result) => {
                    if(result){
                        
                        let sqlQuery = "UPDATE user SET birthDate = ?, addressContent = ?, addressCity = ?, addressZipCode = ?, country = ?, phone = ? WHERE email = ?"
                        let values = [birth_date, cleanedAddressContent, cleanedAddressCity, cleanedAddressZipCode, cleanedAddressCountry, cleanedPhoneNumber, emailCurrentUser]
                        config.query(sqlQuery, values, (err, result) => {
                            if(err) throw err

                            let alertMessagePass
                            let alertMessageInfo
                            let successMessagePass
                            let successMessageInfo = "Vos modifications ont bien été enregistrées !"
                            
                            ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                                res.end(str)
                            })
                        })
                    }
                    else{
                        let successMessagePass
                        let alertMessagePass
                        let successMessageInfo
                        let alertMessageInfo = "Votre mot de passe est incorrect"

                        ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                            res.end(str)
                        })
                    }
                })
            } 
        }
        // If only birthdate input is completed
        else if(birth_date && !address_content && !address_city && !address_zip_code && !address_country && !phone_number && access_password){

            // Clean input before using it
            const cleanedAccessPass = xss(access_password)

            // Get email and password in session of current user
            let emailCurrentUser = req.session.user.email
            let passwordCurrentUser = req.session.user.password

            // Compare password input and password in DB
            bcrypt.compare(cleanedAccessPass, passwordCurrentUser, (err, result) => {
                if(result){
                    let sqlQuery = "UPDATE user SET birthDate = ? WHERE email = ?"
                    let values = [birth_date, emailCurrentUser]
                    config.query(sqlQuery, values, (err, result) => {
                        if(err) throw err

                        let alertMessagePass
                        let alertMessageInfo
                        let successMessagePass
                        let successMessageInfo = "Votre modification a bien été enregistrée !"
                        
                        ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                            res.end(str)
                        })
                    })
                }
                else{
                    let successMessagePass
                    let alertMessagePass
                    let successMessageInfo
                    let alertMessageInfo = "Votre mot de passe est incorrect"

                    ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                        res.end(str)
                    })
                }
            })
        }
        // If 4 inputs regarding the address are completed
        else if(!birth_date && address_content && address_city && address_zip_code && address_country && !phone_number && access_password){
            // Clean inputs before using them
            const cleanedAddressContent = xss(address_content)
            const cleanedAddressCity = xss(address_city)
            const cleanedAddressZipCode = xss(address_zip_code)
            const cleanedAddressCountry = xss(address_country)
            const cleanedAccessPass = xss(access_password)

            // Get email and password in session of current user
            let emailCurrentUser = req.session.user.email
            let passwordCurrentUser = req.session.user.password

            let checkZipCode = ifHaveLetters(address_zip_code)
            
            if(address_zip_code.length > 5 || address_zip_code.length < 5 || checkZipCode == true){
                let successMessagePass
                let alertMessagePass
                let successMessageInfo
                let alertMessageInfo = "Le code postal est invalide"

                ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                    res.end(str)
                })
            }
            else{
                // Compare password input and password in DB
                bcrypt.compare(cleanedAccessPass, passwordCurrentUser, (err, result) => {
                    if(result){
                        
                        let sqlQuery = "UPDATE user SET addressContent = ?, addressCity = ?, addressZipCode = ?, country = ? WHERE email = ?"
                        let values = [cleanedAddressContent, cleanedAddressCity, cleanedAddressZipCode, cleanedAddressCountry, emailCurrentUser]
                        config.query(sqlQuery, values, (err, result) => {
                            if(err) throw err

                            let alertMessagePass
                            let alertMessageInfo
                            let successMessagePass
                            let successMessageInfo = "Vos modifications ont bien été enregistrées !"
                            
                            ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                                res.end(str)
                            })
                        })
                    }
                    else{
                        let successMessagePass
                        let alertMessagePass
                        let successMessageInfo
                        let alertMessageInfo = "Votre mot de passe est incorrect"

                        ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                            res.end(str)
                        })
                    }
                })
            }
        }
        // If only phone number input is completed
        else if(!birth_date && !address_content && !address_city && !address_zip_code && !address_country && phone_number && access_password){
            
            // Clean inputs before using them
            const cleanedPhoneNumber = xss(phone_number)
            const cleanedAccessPass = xss(access_password)

            // Get email and password in session of current user
            let emailCurrentUser = req.session.user.email
            let passwordCurrentUser = req.session.user.password

            let checkPhoneNumber = ifHaveLetters(phone_number)
            
            // Check length of phone number and if it contains letters
            if(phone_number.length > 10 || phone_number.length < 10 || checkPhoneNumber == true){
                let successMessagePass
                let alertMessagePass
                let successMessageInfo
                let alertMessageInfo = "Le numéro de téléphone renseigné est invalide (doit être au format suivant : 0611223344)"

                ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                    res.end(str)
                })
            }
            else{
                // Compare password input and password in DB
                bcrypt.compare(cleanedAccessPass, passwordCurrentUser, (err, result) => {
                    if(result){
                        let sqlQuery = "UPDATE user SET phone = ? WHERE email = ?"
                        let values = [cleanedPhoneNumber, emailCurrentUser]
                        config.query(sqlQuery, values, (err, result) => {
                            if(err) throw err

                            let alertMessagePass
                            let alertMessageInfo
                            let successMessagePass
                            let successMessageInfo = "Votre modification a bien été enregistrée !"
                            
                            ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                                res.end(str)
                            })
                        })
                    }
                    else{
                        let successMessagePass
                        let alertMessagePass
                        let successMessageInfo
                        let alertMessageInfo = "Votre mot de passe est incorrect"

                        ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                            res.end(str)
                        })
                    }
                })
            }
        }
        else{
            let successMessagePass
            let alertMessagePass
            let successMessageInfo
            let alertMessageInfo = "Merci de bien vouloir remplir le/les champ/s que vous souhaitez compléter/modifier !"

            ejs.renderFile('./views/changeInfoUser.ejs', { alertMessagePass, successMessagePass, alertMessageInfo, successMessageInfo }, {}, (err, str) => {
                res.end(str)
            })
        }
    }
}

// Function allowing to check if string contains letters
function ifHaveLetters(str) {
    return /[A-Za-z]/.test(str)
}

module.exports = updateSubmit