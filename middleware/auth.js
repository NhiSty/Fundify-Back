const jsonwebtoken = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       // Display error message
        res.status(401).json({ error: "You need to be logged in to access this feature" });
   }
};
