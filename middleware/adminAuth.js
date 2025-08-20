const checkSession = (req, res, next) => {
    if (!req.session.admin) {
      return res.redirect('/admin/login');
    }
    next();
  };
  
  const isLogin = (req, res, next) => {
    if (req.session.admin) return res.redirect('/admin/dashboard');
  
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  };
  
  module.exports = {
    checkSession,
    isLogin
  };