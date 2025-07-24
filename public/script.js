const loginForm = document.querySelector('.login_form');
const usernameInput = document.querySelector('input[type="text"]');
const passwordInput = document.querySelector('input[type="password"]')
const submitButton = document.querySelector('button[type="submit"]')

loginForm.addEventListener('submit', async(e)=>{
    e.preventDefault()

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    try{
        if(!username || !password){
            showError('Please enter both username and password')
            return;
        }

        const response = await fetch('http://localhost:3000/auth/login', {
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
            //login successfull
            if (data.accessToken){
                sessionStorage.setItem('authToken', data.accessToken);
            }

            //show success
            showSuccess('Login successful!!');
            
            //clear the form
            usernameInput.value = '';
            passwordInput.value = '';

        } else {
            showError (data.message);
        }
    }
    catch(error) {
        console.error('Login error:', error);
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
