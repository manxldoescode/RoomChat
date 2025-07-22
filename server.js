require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth-routes')
const connectToDb = require('./database/db')



connectToDb();



const app = express();
const PORT = 3000;



// const io = socketIo(server);


app.use(express.json())


app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`) 
})
app.use('/auth', authRoutes)
