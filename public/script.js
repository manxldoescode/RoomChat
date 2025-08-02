const loginForm = document.querySelector('.login_form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password')
const submitButton = document.querySelector('#submitBtn')
const loginToggle = document.querySelector('#loginToggle');
const registerToggle = document.querySelector('#registerToggle')
const usernameLabel = document.querySelector('#usernameLabel');


let currentMode = 'login';

//Toggle button event listeners
loginToggle.addEventListener('click', ()=> {
    switchMode('login')
})

registerToggle.addEventListener('click', () => {
    switchMode('register')
})

function switchMode(mode) {
    currentMode = mode;

    if(mode === 'login'){
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');

        //Update form for login

        usernameLabel.textContent = 'enter your alias';
        submitButton.textContent = 'GETIN';
    } else {
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');

        //update form for registratoin 
        usernameLabel.textContent = 'Choose your alias'
        submitButton.textContent = 'JOIN THE CULT'
    }

    //clear form and messages when switching
    usernameInput.value = '';
    passwordInput.value = '';
    removeMessages();
}







loginForm.addEventListener('submit', async(e)=>{
    e.preventDefault()

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    try{
        if(!username || !password){
            showError('Please enter both username and password')
            return;
        }

        if (currentMode === 'register') {
            if (username.length < 4) {
                showError('ADD THEM ALPHABETS IN YO ALIAS')
                return
            }

            if (password.length < 6){
                showError('I AINT SAVING YO ASS IF THIS SHIT IS LESS THAN 6')
                return
            }
        }

        const endpoint = currentMode === 'login' ? '/auth/login' : '/auth/register';

        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if(data.success){

            //success handling
            console.log(`${currentMode} successful:`, data);

            if (currentMode === 'login'){
                //login successful
                if(data.accessToken){
                    sessionStorage.setItem('authToken', data.accessToken)
                    sessionStorage.setItem('username', username);
                }

                showSuccess(`welcome back, ${username}! login succesful`)
            } else {
                showSuccess(`Account created successfully! You can sign in.`);

                //auto-switch after regisration 
                setTimeout(() => {
                    switchMode('login');
                    usernameInput.value = username;
                }, 2000);
            }
            
            
            //clear the form
            usernameInput.value = '';
            passwordInput.value = '';



        } else {
            showError (data.message || `${currentMode} failed. Please try again!`);
            
        }
    }
    catch(error) {
        console.error(`${currentMode}`, error);
        showError('Connection error, Please try again');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'GETIN';
    }

});


function showError(message) {
    //remove any messages
    removeMessages();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
        errorDiv.style.cssText = `
        color: #ff4444;
        background: rgba(255, 68, 68, 0.1);
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        font-size: 14px;
        border: 1px solid rgba(255, 68, 68, 0.3);
        text-align: center;
    `;

    loginForm.appendChild(errorDiv);

    //auto-remove
    setTimeout(() => {
        if(errorDiv.parentNode){
            errorDiv.remove()
        }
    }, 5000)
}

function showSuccess(message){
    removeMessages();

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        color: #44ff44;
        background: rgba(68, 255, 68, 0.1);
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        font-size: 14px;
        border: 1px solid rgba(68, 255, 68, 0.3);
        text-align: center;
    `;

    loginForm.append(successDiv)
}

function removeMessages(){
    const existingMessages = loginForm.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => msg.remove());
}
