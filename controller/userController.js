
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const saltround= 10;

const registerUser = async (req, res) => {
    try{

        const {email, password} = req.body;

        const user= await User.findOne({email})//checks if the user already exists
     
        if(user)  return res.render('user/register', {message: 'user already exists'})

       const hashPassword = await bcrypt.hash(password, saltround);

        const newUser = new User({
            email,
           password: hashPassword
        })

        await newUser.save()
    
        res.render('user/login', {message: 'user created successfully'});
        console.log('created');

    }catch(error){
    res.render('user/register', {message: 'something went wrong!'})
    }
}

const login = async (req, res) => {
try{
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
      const {email, password}= req.body;// take email and password from request body.
      const user = await User.findOne({email});//check if an user with the email exists

      if(!user) return res.render('user/login', {message: 'user does not exists'})// if the user does not exists, we send back a message saying user does not exists
      
       const isMatch = await bcrypt.compare(password, user.password)// compare user entered password and hashed password in database
      if(!isMatch) return res.render('user/login', {message: 'incorrect password'})// incase of incorrect password, we send a message
    
      req.session.user = true;
      req.session.email = user.email;
      
      return res.redirect('/user/home');

 }catch(error){
    res.render('user/login', {message: 'something went wrong!'})
    }
}
const logout = (req, res) => {
    req.session.destroy((err) =>{
        if(err){
            console.log('Error destroying session:', err);
            return res.send('Error logging out');
        }
        res.clearCookie("connect.sid");
        res.redirect('/user/login');
    })
   
}

const loadRegister = (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
   res.render('user/register')
}
const loadLogin = (req,res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.render('user/login')
}
const loadHome = (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const email = req.session.email?.split('@')[0] || 'User';
    res.render('user/userHome', { message: 'Login successful', email });
  };
module.exports = {
    registerUser,
    loadRegister,
    loadLogin,
    login,
    loadHome,
    logout
}