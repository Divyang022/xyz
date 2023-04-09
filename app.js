const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const uuser = require('./controller/user'); 
const ErrorClass = require('./utilities/errorClass');
const wrapAsync = require('./utilities/wrapAsync');
const session = require('express-session');
app.use(express.urlencoded({extended : true}));
const flash = require('connect-flash');
const { isLoggedIn} = require('./middleware');
const Job = require('./models/jobs');



mongoose.connect('mongodb://0.0.0.0:27017/job-seeker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Database Connected here');
})
.catch((err)=>{
    console.log(err, 'This is the error');
})

const secretive = {
    secret: 'Thisisasecretsodonttellanyone',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000*60*60*24,
        maxAge: 1000*60*60*24,
        httpOnly: true
    }
}

app.use(session(secretive));

//For authentication stufff
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req,res)=>{
    res.render('home.ejs');
})

app.get('/job', isLoggedIn, async(req,res)=>{
    const jobs = await Job.find({});
    res.render('job.ejs', {jobs});
})

app.get('/apply', isLoggedIn, async(req, res)=>{
    const user = req.user._id;
    const application = await User.findById(user).populate('applications');
    res.render('apply.ejs', {application});
})

app.get('/register', uuser.registerGet)

app.post('/register', wrapAsync(uuser.registerPost))

app.get('/login', uuser.loginGet)

app.post('/login', passport.authenticate('local', {failureRedirect:'/login'}), uuser.loginPost)

app.get('/logout', uuser.logout)


app.get('/job/:id', isLoggedIn, async(req,res)=>{
    const Id = req.params.id;   
    const jobs = await Job.findById(Id)
    res.render('indexwithid.ejs', {jobs});
})

app.post('/job/:id', async(req,res)=>{
    const Id = req.params.id;   
    const jobs = await Job.findById(Id);        
    const user = req.user.id;
    const users = await User.findById(user);
    console.log(users);
    users.applications.push(Id);
    await users.save();
    req.flash('success', 'Successfully Applied');
    res.redirect('/apply');
})

app.all('*', (req,res,next)=>{
    next(new ErrorClass('Page Not Found', 404));
})



app.use((err,req,res,next)=>{
    const { status = 500, message = 'Something Went wrong!!!'} = err;
    res.render('error.ejs', { err });
})


app.listen(3000, ()=>{
    console.log('Listing on port 3000!!!');
})