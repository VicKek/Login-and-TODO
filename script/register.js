import { isValidEmail, isValidPassword } from './validation.js';

for (let key in localStorage) {
    if (key.startsWith("task-")) {
        localStorage.removeItem(key);
    }
}
localStorage.removeItem('loggedInUser');

const userIn = document.querySelector('.username input');
const passInOne = document.querySelector('.password-one input');
const passInTwo = document.querySelector('.password-two input');
const emailIn = document.querySelector('.email input');
const registerBtn = document.querySelector('.submit-buttton'); 
const clearBtn = document.querySelector('.clear'); 

registerBtn.addEventListener('click',()=>{
    
    localStorage.setItem("name",userIn?.value.trim())
    localStorage.setItem("pass",passInOne?.value.trim())
    localStorage.setItem("checkpass",passInTwo?.value.trim())
    localStorage.setItem("mail",emailIn?.value.trim())

})

clearBtn.addEventListener('click',()=>{
    localStorage.removeItem('name')
    localStorage.removeItem('pass')
    localStorage.removeItem('checkpass')
    localStorage.removeItem('mail')

})
