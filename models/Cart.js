const config = require('../tools/database')

let cart = null

class ShoppingCart {

    static save(meal) {

        // Create model for the cart
        if (cart === null) {
            cart = { meals: [], totalPrice: 0 }
        }

        // Check if meal is existing in cart
        const existingMealIndex = cart.meals.findIndex(p => p.id == meal.id); 
        
        // Exists in cart already
        if (existingMealIndex >= 0) { 
            const existingMeal = cart.meals[existingMealIndex]
            existingMeal.quantity += 1

            cart.totalPrice += meal.price
        } 
        // Doesn't exist in cart
        else { 
            meal.quantity = 1
            cart.meals.push(meal)

            cart.totalPrice += meal.price
        }
    }

    static getCart() {
        return cart
    }

    static emptyCart() {
        cart = null

        return cart
    }

    static delete(mealId) {

        // Get the index of the meal in the cart-meals array
        const isExisting = cart.meals.findIndex(p => p.id == mealId)

        if (isExisting >= 0) {
            const deletedMeal = cart.meals[isExisting]
            cart.totalPrice -= deletedMeal.price * deletedMeal.quantity
            cart.meals.splice(isExisting, 1)
        }

        return cart
    }

    static checkout(user_id){
        let totalAmount = cart.totalPrice
        let dateNow = new Date()

        let sqlQuery = "INSERT INTO orders (user_id, totalAmount, creationOrderTime) VALUES (?, ?, ?)"
        let values = [user_id, totalAmount, dateNow]
        config.query(sqlQuery, values, (err, result) => {
            if(err) throw err 

            let order_id = result.insertId

            cart.meals.forEach(meal => {
                let meal_id = meal.id
                let quantity = meal.quantity
                let price = meal.price

                let sqlQuery2 = "INSERT INTO orderdetails (quantityOrdered, meal_id, order_id, priceEach) VALUES (?, ?, ?, ?)"
                let values2 = [quantity, meal_id, order_id, price]
                config.query(sqlQuery2, values2, (err, result) => {
                    if(err) throw err 

                    cart = { meals: [], totalPrice: 0 }

                    return cart
                })
            })
        })
    }
}

module.exports = ShoppingCart