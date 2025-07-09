import { isValidEmail, isValidPassword } from './validation.js';

const form = document.getElementById("login-form");
const usernameEmailInput = document.getElementById("username-email");
const passwordInput = document.getElementById("password");

const usernameEmailError = document.getElementById("username-email-error");
const passwordError = document.getElementById("password-error");


form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let isValid = true;

    // clear from previous errors - inputs
    [usernameEmailError,passwordError].forEach(x=> x.textContent="");
    [usernameEmailInput,passwordInput].forEach(x=>x.classList.remove('error'));

    const usernameOrEmail = usernameEmailInput.value.trim();
    const password = passwordInput.value;
    
    if (!usernameOrEmail) {
        usernameEmailInput.classList.add("error");
        isValid = false;
    } else {
        // If it is an email (has @)
        if (usernameOrEmail.includes("@")) {
            if (!isValidEmail(usernameOrEmail)) {
                usernameEmailError.textContent = "Invalid email format!";
                usernameEmailInput.classList.add("error");
                isValid = false;
            }
        }
    }

    if (!password) {
        passwordInput.classList.add("error");
        isValid = false;
    } else if (!isValidPassword(password)) {
        passwordError.textContent = "Password must be at least 8 characters long and contain both letters and numbers!";
        passwordInput.classList.add("error");
        isValid = false;
    }

    if (isValid) {
        // Load data from file
        const response = await fetch('api/users');
        const users = await response.json();

        // If a user haing this info exists
        const user = users.find(u =>
            (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
            u.password === password
        );

        if (user) {
            window.location.href = "todo.html";
            localStorage.setItem("loggedInUser", JSON.stringify(user));
        } else {
            passwordError.textContent = "Incorrect username/email or password.";
            usernameEmailInput.classList.add("error");
            passwordInput.classList.add("error");
        }
        
    }
});
