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

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let isValid = true;

    // clear from previous errors 
    usernameEmailError.textContent = "";
    passwordError.textContent = "";
    usernameEmailInput.classList.remove("error");
    passwordInput.classList.remove("error");

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
            }}}

    if (!password) {
        passwordInput.classList.add("error");
        isValid = false;
    } else if (!isValidPassword(password)) {
        passwordError.textContent = "Password must be at least 8 characters long and contain both letters and numbers!";
        passwordInput.classList.add("error");
        isValid = false;
    }

    if (isValid) {
        
        const response = await fetch("users_data.json");
        const users = await response.json();

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
