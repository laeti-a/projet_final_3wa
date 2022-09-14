const ejs = require("ejs")
const config = require('../tools/database')

const displayAdminBookings = {
    adminBookings: async (req, res) => {

        let sqlQuery = "SELECT booking.bookingDate, booking.bookingTime, booking.nbOfSeats, booking.creationTime, user.lastName, user.firstName FROM booking INNER JOIN user ON booking.user_id = user.id"
        config.query(sqlQuery, (err, result) => {
            if(err) throw err

            let bookings = Object.values(JSON.parse(JSON.stringify(result)))

            bookings.forEach(val => {
                let date = val.bookingDate 
                let creationTime = val.creationTime

                let splitDate = date.split('T')
                let splitTime = creationTime.split('T')

                let newDate = splitDate[0]
                let newTime = splitTime[0]

                val.bookingDate = newDate
                val.creationTime = newTime
            })

            res.writeHead(200, { 'Content-Type': 'text/html' })

            // str = vue compilée avec les données
            ejs.renderFile('./views/adminBookings.ejs', { bookings }, {}, (err, str) => {
                res.end(str)
            })
        })
    }
}

module.exports = displayAdminBookings