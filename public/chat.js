//check if the user is logged in
const authToken = sessionStorage.getItem('authToken');
const username = sessionStorage.getItem('username');

if (!authToken || !username){
    //redirect to the login page
    alert('login bitchass!');
    window.location.href = 'index.html'
}


//intialize Socket.IO connection

const socket = io('http://localhost:3000');

//DOM elements
const messagesContainer = document.getElementById('messagesContainer');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const usersList = document.getElementById('usersList');
const currentUsername = document.getElementById('currentUsername');
const typingIndicator = document.getElementById('typingIndicator');
const logoutBtn = document.getElementById('logoutBtn');


//set current username in the sidebar
currentUsername.textContent = username;

//connection event
socket.on('connect', ()=> {
    console.log('connected to server');

    socket.emit('user_join', {
        username: username,
        token: authToken
    })
});

//disconnect event
socket.on('disconnect', ()=> {
    console.log('disconnected from server');
    showSystemMessage('Connection lost. Trying to reconnect..')
    
});

//reconnect event
//{not writing it rn}

//handle incoming messages
socket.on('receive_message', (messageData)=> {
    displayMessage(messageData)
});

//handle user joined notifications
socket.on('user_joined', (data)=>{
    showSystemMessage(data.message);
})

//handle user left notification
socket.on('user_left', (data) => {
    showSystemMessage(data.message)
})

//handle users list updates
socket.on('update_users_list', (users) => {
    updateUsersList(users)
})

//Form submission
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = messageInput.value.trim();
    if(message){
        //send message to server
        socket.emit('send_message', {
            message: message
        });

        //clear the input 
        messageInput.value = '';

    }    
})


//logout functionality
logoutBtn.addEventListener('click', ()=> {
    if(confirm('are you sure about leaving ts?')) {
        //Clear session storage
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('username');

        //disconnect from the socket
        socket.disconnect();

        //redirect to the login page
        window.location.href = 'index.html'
    }
})