const form = document.getElementById("login-form");
const usernameEmailInput = document.getElementById("username-email");
const passwordInput = document.getElementById("password");

const usernameEmailError = document.getElementById("username-email-error");
const passwordError = document.getElementById("password-error");

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

function isValidPassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}

// Form validation logic
form.addEventListener("submit", function (e) {
    e.preventDefault(); 

    let isValid = true;

    usernameEmailError.textContent = "";
    passwordError.textContent = "";
    usernameEmailInput.classList.remove("error");
    passwordInput.classList.remove("error");

    if (!usernameEmailInput.value) {
        usernameEmailError.textContent = "Username or Email is required!";
        usernameEmailInput.classList.add("error");
        isValid = false;
    } else if (!isValidEmail(usernameEmailInput.value) && !usernameEmailInput.value.includes("@")) {
        usernameEmailError.textContent = "Please enter a valid email address!";
        usernameEmailInput.classList.add("error");
        isValid = false;
    }

    if (!passwordInput.value) {
        passwordError.textContent = "Password is required!";
        passwordInput.classList.add("error");
        isValid = false;
    } else if (!isValidPassword(passwordInput.value)) {
        passwordError.textContent = "Password must be at least 8 characters long and contain both letters and numbers!";
        passwordInput.classList.add("error");
        isValid = false;
    }

    if (isValid) {
        form.submit(); 
    }
});
