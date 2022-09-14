// Check that user is logged in to access specific pages

function authMiddleware(req, res, next){
    
    if (!req.session.user) {
        return res.redirect('/loginRegister')
    }

    next()
}

module.exports = authMiddleware
