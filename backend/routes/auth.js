const express = require('express')
const router = express.Router();


const { registredUser,loginUser } = require('../controllers/authcontroller')
const { verifytoken } =require('../middleware/authMiddleware')

router.post('/register',registredUser);
router.post('/login',loginUser)

router.get('/protected',verifytoken,(req,res)=>{
    res.json({message:"You are authorized", userID:req.user.userID})
})


module.exports = router;
