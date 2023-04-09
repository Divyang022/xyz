const User = require('../models/user');

module.exports.registerGet = (req,res)=>{
    res.render('register');
}

module.exports.registerPost = async(req,res)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const withpass = await User.register(user, password);
    req.login(withpass, err =>{
        if(err){
            //for error handler
            return next(err);
        }
        req.flash('success', 'Successfully Signed you In!!');
        res.redirect('/job');
    })
    }
    catch(e){
        req.flash('error', 'e.message');
        res.redirect('/register');
    }
}
module.exports.loginPost = (req,res)=>{
    req.flash('success', 'Logged you In');
    const redirectUrl = req.session.returnTo || '/job';
    console.log(redirectUrl);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.loginGet = (req,res)=>{
    res.render('login');
}
module.exports.logout = (req,res)=>{
    req.logout(function(){
        req.flash('success', 'Successfully Logged you out!!');
        res.redirect('/job');
    });
}

