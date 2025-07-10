const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());



const authRoutes = require('./routes/auth');
app.use('/api/auth',authRoutes);

const groupsRoutes = require('./routes/groupRoutes');
app.use('/api/groups',groupsRoutes)

mongoose.connect((process.env.MONGO_URI))
    .then(()=> console.log("MongoDb is Connected"))
    .catch((err)=> console.error("Error in connecting to the MongoDB",err))

const PORT= process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server Running on port http://localhost:${PORT}`)
})
