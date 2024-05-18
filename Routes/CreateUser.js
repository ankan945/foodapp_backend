const express=require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var fetchuser = require('../middleware/fetchuser');
const Orders = require('../models/Orders');

const jwtSecret = "tdrfgvhgddrfcgytrsdfghbnpokbvgb"

router.post("/createuser",[
body('email').isEmail(),
body('password','password must contain atleast 5 charectes').isLength({ min: 5 })]
,async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secuPassword = await bcrypt.hash(req.body.password,salt);
    try{
       await User.create({
            name: req.body.name,
            password:secuPassword,
            email:req.body.email,
            location:req.body.location
        })
        res.json({success:true});
    }catch(error){
        console.log(error)
        res.json({success:false});
    }
})

router.post("/loginuser",[
    body('email').isEmail(),
    body('password','password must contain atleast 5 charectes').isLength({ min: 5 })],async(req,res)=>{

        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email;
    let pass=req.body.password;
        try{
           let userData = await User.findOne({email});
           if(!userData){
            return res.status(400).json({ errors:"Username and password doest'nt matched" });
           }
           const pwdCompare = await bcrypt.compare(pass,userData.password);
           if(!pwdCompare){
            return res.status(400).json({ errors:"Username and password doest'nt matched" });
          }
           const data = {
            user:{
                id:userData.id
            }
           }
           const authToken = jwt.sign(data,jwtSecret)
           res.json({success:true,authToken:authToken});
        }catch(error){
            console.log(error)
            res.json({success:false});
        }
    })
    router.get('/getuser',fetchuser,async (req,res)=>{

        try{
        const userId=req.user.id;
        const user = await User.findById(userId).select("-password");//here using user id we r fetching all the data except his password
        res.send(user);
        
        }catch(error){
        
            console.error(error);
            res.status(500).send("some error");
        }
         })
     router.get('/fetchallorders',fetchuser,async (req,res)=>{

            try{
                const userId=req.user.id;
                const user = await User.findById(userId).select("-password");
                const usermail=user.email;
                //console.log(`user email is ${user.email}`);   
           const orders= await Orders.find({ email:usermail });
          // console.log(orders);
           res.json(orders);
            }catch(error){
                console.error(error);
                res.status(500).send("some error");
            }
        
        })    

module.exports=router;