const express = require('express')
const upload = require('../tools/multer')

// Get files from controllers folder
const displayHome = require('../controllers/display_home')
const displayMenu = require('../controllers/display_menu')
const displayBooking = require('../controllers/display_booking')
const displayOrder = require('../controllers/display_order')
const displayLoginRegister = require('../controllers/display_loginRegister')

const displayCart = require('../controllers/display_cart')

const displayAccountAdmin = require('../controllers/display_account_admin')
const displayChangeMenu = require('../controllers/display_changeMenu')
const displayAdminBookings = require('../controllers/display_admin_bookings')
const displayAdminOrders = require('../controllers/display_admin_orders')

const displayAccount = require('../controllers/display_account')
const displayChangeInfoUser = require('../controllers/display_changeInfoUser')
const displayInfoUser = require('../controllers/display_infoUser')

const displayUserOrders = require('../controllers/display_user_orders')

const logoutController = require('../controllers/logoutController')


const { submitBooking } = require('../controllers/submitBookingController')
const { addToCart, deleteFromCart, emptyCart, checkout } = require('../controllers/submitCartController')


const { submitFormLogin, submitFormRegister } = require('../controllers/submitFormsLogRegisterController')
const { submitPassword, submitInformation } = require('../controllers/submitUpdateUserController')
const { getDeleteAccount, submitDeleteAccount } = require('../controllers/submitDeleteAccountController')
const { submitAddMeal, submitDeleteMeal, submitUpdateMeal, submitUploadImage } = require('../controllers/submitChangeMenuController')


const authMiddleware = require('../middlewares/middleware')

// Router
const router = (() => {
	const apiRouter = express.Router()

	// ROUTES GET 
	// Route "Home"
	apiRouter.route('/').get(displayHome.home)
	
	// Route "Menu"
	apiRouter.route('/menu').get(displayMenu.menu)

	// Route "Réservation"
	apiRouter.route('/booking').get(displayBooking.booking)

	// Route "Commander"
	apiRouter.route('/order').get(displayOrder.displayOrder)

	// Routes "Panier"  
	apiRouter.route('/cart').get(authMiddleware, displayCart.displayCart) 

	// Route "S'inscrire / Se Connecter"
	apiRouter.route('/loginRegister').get(displayLoginRegister.loginRegister)

	// Routes "Mon Compte" (admin ou user classique)
	apiRouter.route('/my-account').get(authMiddleware, displayAccount.myaccount)
	apiRouter.route('/my-account-admin').get(authMiddleware, displayAccountAdmin.accountAdmin)

	// Route "Modifier le menu"
	apiRouter.route('/update-menu').get(authMiddleware, displayChangeMenu.changeMenu)

	// Route "Afficher les réservations" (quand user = admin)
	apiRouter.route('/show-bookings').get(authMiddleware, displayAdminBookings.adminBookings)

	// Route "Afficher les commandes" (quand user = admin)
	apiRouter.route('/show-orders').get(authMiddleware, displayAdminOrders.adminOrders)

	// Route "Mes commandes" (quand user != admin)
	apiRouter.route('/my-orders').get(authMiddleware, displayUserOrders.userOrders)

	// Routes "Informations"
	apiRouter.route('/informations').get(authMiddleware, displayInfoUser.infoUser)
	apiRouter.route('/change-informations').get(authMiddleware, displayChangeInfoUser.changeInfoUser)

	// Route "Supprimer mon compte"
	apiRouter.route('/delete-account').get(authMiddleware, getDeleteAccount)

	// Route "Déconnexion"
	apiRouter.route('/logout').get(logoutController.logout)


	
	// ROUTES POST
	// Inscription
	apiRouter.route('/loginRegister/registered').post(submitFormRegister)

	// Connexion
	apiRouter.route('/loginRegister/loggedin').post(submitFormLogin)

	// Modifications User
	apiRouter.route('/informations/update-pass').post(authMiddleware, submitPassword)
	apiRouter.route('/informations/update-info').post(authMiddleware, submitInformation)

	// Suppression compte
	apiRouter.route('/deleted').post(authMiddleware, submitDeleteAccount)

	// Modifications Menu
	apiRouter.route('/update-menu/add-meal').post(authMiddleware, upload.single("files"), submitAddMeal)
	apiRouter.route('/update-menu/delete-meal').post(authMiddleware, submitDeleteMeal)
	apiRouter.route('/update-menu/update-meal').post(authMiddleware, submitUpdateMeal)
	apiRouter.route('/update-menu/upload-image').post(authMiddleware, upload.single("image"), submitUploadImage)

	// Réservation
	apiRouter.route('/booked').post(authMiddleware, submitBooking)

	// Commander / Panier
	apiRouter.route('/add-to-cart').post(authMiddleware, addToCart)
	apiRouter.route('/delete-fromCart').post(authMiddleware, deleteFromCart)
	apiRouter.route('/empty-cart').post(authMiddleware, emptyCart)
	apiRouter.route('/checkout').post(authMiddleware, checkout)
	
	return apiRouter
})()

module.exports = router