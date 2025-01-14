// Authentication middleware
const checkAuthentication = (req, res, next) => {
    if (req.session && req.session.user) {
      next();
    } else {
   
      res.redirect('/');
    }
  };
  exports.checkAuthentication = checkAuthentication;