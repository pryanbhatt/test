const express = require('express');
const Routes = require('./routes/index.router');
const userRoutes = require('./routes/users.router');
const dashboardRoutes = require('./routes/dashboard.router');
require("dotenv").config();
const connection = require("./config/db");
const Grid = require("gridfs-stream");


//const bodyParser = require('body-parser');
//const multer  = require('multer');
//const sharp = require('sharp');
//const uuid = require('uuid/v4');


const mongoose = require('mongoose');
//const uri = "mongodb+srv://admintest:Nongstoin$124@instrappcls0.c0wou.mongodb.net/testdb?retryWrites=true&w=majority";

const passport = require('passport');
require("./config/passport")(passport);

const expressEjsLayout = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');


const app = express();


const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(expressEjsLayout);

app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//connect to db
connection();


let gfs;
const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
});

//Routes
app.use('/',Routes);
app.use('/users',userRoutes);
app.use('/dashboard',dashboardRoutes);


app.listen(port, function(err){
    if(!err){
        console.log('Server initialised on port: ' + port);
        
        
        
    }
    
    else{
        console.log('Sorry.. Error initialising Server: ' + err);
    }
})
