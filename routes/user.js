
const express= require('express')//load express framework
const router = express.Router()//Creates a new router object to define all user related routes
const userController = require('../controller/userController');//Imports the userController, which contains the logic for registering, logging in, and rendering pages
const auth = require('../middleware/auth')//Imports custom middleware to protect routes based on session login status.

router.get('/login',auth.isLogin, userController.loadLogin)//if request to /user/login, checks isLoggin(Show login form, only if not logged in), then  
router.post('/login',userController.login)

router.get('/register',auth.isLogin, userController.loadRegister)
router.post('/register',userController.registerUser);

router.get('/logout', auth.checkSession, userController.logout)
router.get('/home', auth.checkSession, userController.loadHome);



module.exports = router;
