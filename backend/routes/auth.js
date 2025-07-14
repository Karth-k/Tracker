const express = require('express')
const router = express.Router();


const { registredUser,loginUser, verifyOtp } = require('../controllers/authcontroller')


router.post('/register',registredUser);
router.post('/login',loginUser)
router.post('/verify-otp', verifyOtp);


module.exports = router;