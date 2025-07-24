require('dotenv').config();
const express = require('express');
const http = require('http');
// const socketIo = require('socket.io');
const authRoutes = require('./routes/auth-routes')
const connectToDb = require('./database/db')
const cors = require('cors');


connectToDb();



const app = express();
const PORT = 3000;



// const io = socketIo(server);
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true
}));


app.use(express.json())
app.use('/auth', authRoutes)

app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`) 
})
