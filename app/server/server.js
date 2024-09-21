const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routes/Routes');
const PORT = process.env.PORT;
const app = express();
const cors = require('cors')
const db_URL = process.env.dbURL;




app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    next();
    
     });




app.use('/users', router);

mongoose
    .connect(db_URL, { dbName: "ToDo-Users" })
    .then(()=>{
        console.log("Connected to MongoDB");
        app.listen(PORT,()=>{
            console.log(`Server running on port ${PORT}`)
        });
    })
    .catch((err)=>console.log(err)
    );
