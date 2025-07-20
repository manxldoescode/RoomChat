const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const PORT = 3000;

server.listen(PORT, ()=>{
    console.log("Server is now running")
    
})



const server = http.createServer(app);
const io = socketIo(server);
