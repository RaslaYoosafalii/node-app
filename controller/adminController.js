
const adminModel = require('../model/adminModel');
const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')

const loadLogin = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.render('admin/login')
}
const login = async (req, res) => {
 try{
  const {email, password} = req.body// we take email and password from request body

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  const admin = await adminModel.findOne({email})// checks if the admin exists by finding email
  
  if(!admin) return res.render('admin/login', { message: 'Invalid credentials'})// if admin doesn't exists, send a message
  
 const isMatch = await bcrypt.compare(password, admin.password)// compare hashed passwords
 if(!isMatch) return  res.render('admin/login', { message: 'Incorrect password'})// incase password do not match with password in db

 req.session.admin = true;//stores a flag in the session memory, an admin is logged in
 res.redirect('/admin/dashboard')//logged-in

 }catch(error){
  res.send(error)
 }
}
const loadDashboard = async (req, res) => {
   try{

    const admin =req.session.admin;
    if(!admin) return res.redirect('/admin/login')

   const users = await userModel.find({})     
   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
   res.setHeader('Pragma', 'no-cache');
   res.setHeader('Expires', '0');
   res.setHeader('Surrogate-Control', 'no-store');
   res.render('admin/dashboard',{users})

   }catch(error){
    res.send(error)
   }
}
const editUser = async (req, res) => {
    try{
    
        const { userId, email, password } = req.body;// take email password from request body
        const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.findByIdAndUpdate( userId ,{ email, password: hashedPassword});
   
    const allUsers = await userModel.find({})
    res.redirect('/admin/dashboard')


    }catch(error){
    console.log(error);
    
    }
}
const deleteUser = async (req, res) => {
 try{
  const userId = req.params.id;
  await userModel.findByIdAndDelete(userId)//delete user by id

  res.redirect('/admin/dashboard')
 }catch(error){
  console.log(error)
 }
}
const addUser = async (req, res) => {
    try{
     const {email, password} = req.body// take email and password from request body
     
     const hashedPassword = await bcrypt.hash(password, 10);//hashing password

     const newUser = new userModel({//create new user
        email,
        password: hashedPassword
     })
     await newUser.save()// save it database
    
     res.redirect('/admin/dashboard')// then redirect to dashboard

    }catch(error){
        console.log(error);//if error occur log it on console
        
    }
}


    const logout = async (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                  console.log('Session destroy error:', err);
                  return res.redirect('/admin/dashboard'); // fallback if destroy fails
                }
              
                // Prevent caching and force browser to remove dashboard from memory
                res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
                res.set('Pragma', 'no-cache');
                res.set('Expires', '0');
              
                res.clearCookie('connect.sid'); // Default session cookie name
                res.redirect('/admin/login');
              });
        } catch (error) {
          console.log(error);
        }
      }


module.exports = {
    loadLogin,
    login,
    loadDashboard,
    editUser,
    deleteUser,
    addUser,
    logout
}