const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const logger = require('./tools/winston')
const ejs = require("ejs")
const path = require('path')

const router = require('./routes/router')

require("dotenv").config()

const PORT = process.env.PORT
const SESSION_NAME = process.env.SESSION_NAME
const SESSION_SECRET = process.env.SESSION_SECRET

let cors = require('cors')


// Server config
const app = express()
const port = PORT

// Define static dir
app.use(express.static(path.join(__dirname, 'public')))

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    name: SESSION_NAME,
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
}))

// Cors (allows only some origin to access the app)
app.use(cors())

// Routes
app.use(router)

// Redirect to custom 404 page
app.use((req, res, next) => {
    res.status(404)

	logger.error(`400 || ${req.originalUrl} - ${req.method} - ${req.ip}`)

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

	// str = vue compilée avec les données
	ejs.renderFile('./views/404.ejs', { loggedin, isAdmin }, {}, (err, str) => {
		res.end(str)
	})
})

// Start app
app.listen(port)