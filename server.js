
const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const connectDB = require('./db/connectDB');
const path = require('path')
const session = require('express-session');
const nocache = require('nocache')// to reload the page instead of showing the file that cached in the browser memory when we click back button 
const hbs = require('hbs')


app.use(session({
  secret: 'secretKey',//Used to sign the session ID cookie
  saveUninitialized: false, // Don't create session until something stored
  resave: false,// Don't save session if unmodified
  cookie: {
    maxAge: 1000* 60* 60 //cookie will expire after 1 hour of inactivity
  }
}))

app.use(nocache())
//view engine set up
app.set('views', path.join(__dirname,'views'))//gives full path of the views folder
app.set('view engine','hbs')// using hbs as view engine to render dynamic templates
hbs.registerHelper('inc', function (value) { return parseInt(value) + 1 });

//static assets
app.use(express.static('public'))//we are using public as folder to store static assets

app.use(express.urlencoded({extended: true}))//For parsing form data (from HTML forms)

app.use(express.json())//For parsing raw JSON (from APIs, AJAX, Postman, etc.)


app.use('/user', userRoutes);
app.use('/admin', adminRoutes);


app.get('/', (req, res ) => {
    res.send('hhi from homepage')
    
})

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

connectDB();//connect mongoDB


app.use((req, res) => {
    res.status(404).send(' Page not found');
  });

app.listen(3007,() => {
 console.log(`=============================================`)
 console.log(`server running on http://localhost:3007`)
})