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

//error handling
socket.on('connect_error', (error) => {
    console.log('Connection error:', error);
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
            username: username,
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

//tracking the last user
let lastUser = null;


//function to display a message
function displayMessage(messageData) {
    const messageElement = document.createElement('div')
    messageElement.className = 'message';

    const isOwnMessage = messageData.username === username;

    const showUsername = messageData.username !== lastUser;
    lastUser = messageData.username;

    messageElement.innerHTML = `
        ${showUsername ? `
            <div class="message-header">
                <span class="message-username" style="color: ${isOwnMessage ? '#4CAF50' : '#aa494fff'}">
                    ${messageData.username}${isOwnMessage ? ' (You)' : ''}
                </span>
            </div>
        ` : ''}
        <div class="message-text">${escapeHtml(messageData.message)}</div>
    `;


    messagesContainer.appendChild(messageElement);
    scrolltoBottom();
}

function showSystemMessage(message){
    const messageElement = document.createElement('div');
    messageElement.className = 'system-message';
    messageElement.textContent = message;

    messagesContainer.appendChild(messageElement);
    scrolltoBottom();
}


//function to update users list
function updateUsersList(users){
    usersList.innerHTML= '';
    
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-time';
        userElement.textContent = user === user ? `${user} (You)` : user;
        usersList.appendChild(userElement);
    })
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML
}

//function to scroll to bottom of messages
function scrolltoBottom(){
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

messageInput.focus();

//handle enter key for sending messages
messageInput.addEventListener('keypress', (e)=> {
    if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        messageForm.dispatchEvent(new Event('submit'));
    }
});

console.log('Chat intialized for user:', username);
