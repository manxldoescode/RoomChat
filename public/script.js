const loginForm = document.querySelector('.login_form');
const usernameInput = document.querySelector('input[type="text"]');
const passwordInput = document.querySelector('input[type="password"]')
const submitButtom = document.querySelector('button[type="submit"]')

loginForm.addEventListener('submit', async(e)=>{
    e.preventDefault()

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

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

    } else {
        showError (data.message);
    }
})

