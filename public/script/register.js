import { isValidEmail, isValidPassword } from './validation.js';

for (let key in localStorage) {
    if (key.startsWith("task-")) {
        localStorage.removeItem(key);
    }
}
localStorage.removeItem('loggedInUser');

const usernameInput = document.querySelector('.username input');
const emailInput = document.querySelector('.email input');
const passOneInput = document.querySelector('.password-one input');
const passTwoInput = document.querySelector('.password-two input');

const usernameError = document.querySelector('.username .error-message');
const emailError = document.querySelector('.email .error-message');
const passOneError = document.querySelector('.password-one .error-message');
const passTwoError = document.querySelector('.password-two .error-message');
const form=document.querySelector('.register-form');

form.addEventListener('submit',async function(e){

    e.preventDefault();

    // Clear errors
    [usernameError, emailError, passOneError, passTwoError].forEach(span => span.textContent = '');
    [usernameInput, emailInput, passOneInput, passTwoInput].forEach(input => input.classList.remove('error'));

    let isValid = true;

    // Actual input values
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const pass1 = passOneInput.value.trim();
    const pass2 = passTwoInput.value.trim();

    if (!username) {
        usernameError.textContent = "Please enter a username.";
        usernameInput.classList.add('error');
        isValid = false;
    }

    if (!isValidEmail(email)) {
        emailError.textContent = "Invalid email format.";
        emailInput.classList.add('error');
        isValid = false;
    }

    // Password check
    if (!isValidPassword(pass1)) {
        passOneError.textContent = "Password must be 8+ chars with letters & numbers.";
        passOneInput.classList.add('error');
        isValid = false;
    }

    // Password confirmation
    if (pass1 !== pass2) {
        passTwoError.textContent = "Passwords do not match.";
        passTwoInput.classList.add('error');
        isValid = false;
    }

    if(isValid){
        fetch('/api/users')
            .then(res => res.json())
            .then(users => {
                const userExists = users.some(u => u.username === username || u.email === email);
                if (userExists) {
                    emailError.textContent = "User with this email or username already exists!";
                    email.classList.add("error");
                    username.classList.add('error');
                    return;
                }
                
                let total = users.length;
                const newUser = {
                    id: ++total,
                    username,
                    email,
                    password:pass1,
                    tasks: []
                };

                users.push(newUser);

                return fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(users)
                });
            })
            .then(() => {
                alert("Registration successful!");
                window.location.href = "index.html";
            })
        }else{
            return;
        }
    
})

