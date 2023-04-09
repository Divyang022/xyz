

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
//req.session.returnTo is used to store the url for the page you were about to visit 
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}


