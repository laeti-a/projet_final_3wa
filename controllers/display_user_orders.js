const ejs = require("ejs")
const config = require('../tools/database')

const displayUserOrders = {
    userOrders: async (req, res) => {

        let idCurrentUser = req.session.user.id

        let sqlQuery = 
        `
                SELECT orders.id, meal.nameMeal, orderdetails.quantityOrdered, orders.totalAmount, orders.creationOrderTime
                FROM orders
                INNER JOIN orderdetails
                ON orders.id = orderdetails.order_id
                INNER JOIN meal
                ON orderdetails.meal_id = meal.id
                WHERE orders.user_id = ?
        `
        config.query(sqlQuery, [idCurrentUser], (err, result) => {

            let finalResult = {}

            result.forEach(val => {
                let order_id = val.id
                let creationTime = val.creationOrderTime

                creationTime = creationTime.toLocaleString()

                if(finalResult[order_id] == undefined){
                    finalResult[order_id] = {}
                    finalResult[order_id]['order_id'] = order_id
                    finalResult[order_id]['nameMeal'] = []
                    finalResult[order_id]['quantityOrdered'] = []
                    finalResult[order_id]['totalAmount'] = val.totalAmount
                    finalResult[order_id]['creationOrderTime'] = creationTime
                }

                finalResult[order_id]['nameMeal'].push(val.nameMeal)
                finalResult[order_id]['quantityOrdered'].push(val.quantityOrdered)
            })

            let arrayResults = Object.values(finalResult)

            res.writeHead(200, { 'Content-Type': 'text/html' })

            // str = vue compilée avec les données
            ejs.renderFile('./views/userOrders.ejs', { arrayResults }, {}, (err, str) => {
                res.end(str)
            })
        })
    }
}

module.exports = displayUserOrders