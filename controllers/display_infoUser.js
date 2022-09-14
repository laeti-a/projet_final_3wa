const ejs = require("ejs")
const config = require('../tools/database')

const displayInfoUser = {
    infoUser: async (req, res) => {

        let idCurrentUser = req.session.user.id

        let sqlQuery = "SELECT * FROM user WHERE id = ?"
        let values = [idCurrentUser]
        config.query(sqlQuery, values, (err, result) => {
            if(err) throw err

            let user = Object.values(JSON.parse(JSON.stringify(result)))

            // Check that the user completed his data
            if(user[0].birthDate != null || user[0].addressContent != null || user[0].addressCity != null || user[0].addressZipCode != null || user[0].country != null || user[0].phone != null){
                
                if(user[0].birthDate != null){
                    user.forEach(val => {
                        let birthDate = val.birthDate
                        let cleaned = birthDate.split('T')
                        val.birthDate = cleaned[0]
                    })
                }

                res.writeHead(200, { 'Content-Type': 'text/html' })

                // str = vue compilée avec les données
                ejs.renderFile('./views/infoUser.ejs', { user }, {}, (err, str) => {
                    res.end(str)
                })
            }
            // If not, create user's data array
            else{
                let user = [{
                    birthDate: "Pas encore renseigné",
                    addressContent: "Pas encore renseigné",
                    addressCity: "Pas encore renseigné",
                    addressZipCode: "Pas encore renseigné",
                    country: "Pas encore renseigné",
                    phone: "Pas encore renseigné",
                }]

                res.writeHead(200, { 'Content-Type': 'text/html' })

                // str = vue compilée avec les données
                ejs.renderFile('./views/infoUser.ejs', { user }, {}, (err, str) => {
                    res.end(str)
                })
            }
        })
    }
}

module.exports = displayInfoUser