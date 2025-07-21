require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectToDb = require('./database/db')



connectToDb();

const app = express();
const PORT = 3000;



const server = http.createServer(app);
const io = socketIo(server);

server.listen(PORT, ()=>{
    console.log("Server is now running")
    
})