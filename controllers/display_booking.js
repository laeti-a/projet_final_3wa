const ejs = require("ejs")

const displayBooking = {
    booking: (req, res) => {

        let alertBooking
        let successBooking

        let loggedin
        if(req.session.loggedIn){
            loggedin = req.session.loggedIn
        }
        else{
            loggedin = false
        }

        let isAdmin
        if(req.session.isAdmin){
            isAdmin = req.session.isAdmin
        }
        else{
            isAdmin = false
        }

        res.writeHead(200, { 'Content-Type': 'text/html' })

        // str = vue compilée avec les données
        ejs.renderFile('./views/booking.ejs', { loggedin, isAdmin, alertBooking, successBooking }, {}, (err, str) => {
            res.end(str)
        })
    }
}

module.exports = displayBooking