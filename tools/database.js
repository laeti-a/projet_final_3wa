const mysql = require('mysql')
require("dotenv").config()

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE

// Connection to sql database
let config = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
})

try{
    config.connect(err => {
        if(err) throw err

        console.log('Connected to database!')
    })
}
catch(err){
    if(err) throw err

    console.log("Something went wrong. Can't connect to database");
}
module.exports = config