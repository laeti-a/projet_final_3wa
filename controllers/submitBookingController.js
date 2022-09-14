const config = require('../tools/database')
const ejs = require("ejs")
const bcrypt = require("bcrypt")
const xss = require("xss")

const submitBookingController = {
    submitBooking: (req, res) => {

        const { booking_date, booking_time, number_of_seats } = req.body

        if(booking_date && booking_time && number_of_seats){

            let idCurrentUser = req.session.user.id
            let currentDate = new Date()

            let sqlQuery = "INSERT INTO booking (bookingDate, bookingTime, nbOfSeats, user_id, creationTime) VALUES (?, ?, ?, ?, ?)"
            let values = [booking_date, booking_time, number_of_seats, idCurrentUser, currentDate]
            config.query(sqlQuery, values, (err, result) => {
                if(err) throw err

                let alertBooking
                let successBooking = "C'est réservé ! A bientôt !"

                let loggedin = req.session.loggedIn
                let isAdmin = req.session.user.isAdmin

                res.writeHead(200, { 'Content-Type': 'text/html' })

                // str = vue compilée avec les données
                ejs.renderFile('./views/booking.ejs', { loggedin, isAdmin, alertBooking, successBooking }, {}, (err, str) => {
                    res.end(str)
                })

            })
        }
        else{
            let alertBooking = "Merci de bien vouloir renseigner tous les champs !"
            let successBooking

            let loggedin = req.session.loggedIn
            let isAdmin = req.session.user.isAdmin

            res.writeHead(200, { 'Content-Type': 'text/html' })

            // str = vue compilée avec les données
            ejs.renderFile('./views/booking.ejs', { loggedin, isAdmin, alertBooking, successBooking }, {}, (err, str) => {
                res.end(str)
            })
        }
    }
}

module.exports = submitBookingController