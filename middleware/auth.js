
const checkSession = (req, res, next) => {//middleware to check if the user session already exists before allowung access to the routes

    if (req.session.user){// if exists allow request to continue to the next handler
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        return next()       
    }else{
       return res.redirect('/user/login') //else redirect to login page
    }
}

const isLogin = (req, res, next) => { // check if the session user already logged in
    if(req.session.user){
       
        res.redirect('/user/home')// if the user is logged in, send them straight to the homepage 
    }else{
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        next()// if not logged in, show login page
    }
};


module.exports = {
    checkSession,
    isLogin
}