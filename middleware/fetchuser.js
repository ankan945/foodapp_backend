var jwt = require('jsonwebtoken');
const jwt_secret ="tdrfgvhgddrfcgytrsdfghbnpokbvgb"//const jwtSecret = "tdrfgvhgddrfcgytrsdfghbnpokbvgb"
const fetchuser=(req,res,next)=>{
    //get the user from jwt token and add it to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"plz authenticate using valid token"})
    }
  try{
    const data =jwt.verify(token,jwt_secret);
    req.user=data.user;//here we r getting information regarding user then passing control to next function of auth.js
    next();
  }catch(error){
    res.status(401).send({error:"plz authenticate using valid token"})
  }
}

module.exports=fetchuser;