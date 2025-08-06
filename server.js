require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth-routes')
const connectToDb = require('./database/db')
const cors = require('cors');
const { log, timeStamp } = require('console');


connectToDb();



const app = express();
const PORT = 3000;


//HTTP Server and Socket.io instance
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
        methods: ["GET", "POST"],
        credentials: true
    }
})


// const io = socketIo(server);
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true
}));


app.use(express.json())
app.use('/auth', authRoutes)


//store connected users
const connectedUSers = new Map();

io.on('connection', (socket)=> {
    console.log('user connected:', socket.id);

    //handling user
    socket.on ('user_join', (userData) => {
        console.log(`${userData.username} joined the chat`);

        //store the user's info
        connectedUSers.set(socket.id, {
            username: userData.username,
            sockeId: socket.id
        });

        //notify everyone about the new user
        socket.broadcast.emit('user_joined', {
            username: userData.username,
            message: `${userData.username} joined the chat`,
            timestamp: new Date().toISOString()
        })

        //send current users list to new user
        const userList = Array.from(connectedUSers.values()).map ( user => user.username);
        socket.emit('users_list', userList);

        io.emit('update_users_list', usersList);
        
    });

    socket.on('send_message', (messageData) => {
        const user = connectedUSers.get(socket.id);

        if (user) {
            const message = {
                username: user.username,
                message: messageData.message,
                timestamp: new Date().toISOString()
            };

            console.log('Message from', user.username + ':', messageData.message);

            //sending the message to everyone including the sender
            io.emit('recieve_message', message)
            
        }
    });

    socket.on('disconnect', ()=> {
        const user = connectedUSers.get(socket.id);

        if(user) {
            console.log(`${user.username} disconnected`);
            
            
            //remove user from connected users
            connectedUSers.delete(socket.id);

            //notify all users about the user leaving the convo
            socket.broadcast.emit('user_left', {
                username: user.username,
                message: `${user.username} left the chat`
            });

            //update user list for all the clients
            const usersList = Array.from(connectedUSers.values()).map(user =>  user.username);
        }
    })
    
})

app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`) 
})
