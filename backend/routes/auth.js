const express = require('express')
const router = express.Router();


const { registredUser,loginUser } = require('../controllers/authcontroller')


router.post('/register',registredUser);
router.post('/login',loginUser)
router


module.exports = router;