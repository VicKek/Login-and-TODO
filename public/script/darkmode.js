//This is the js file that jandles the switch for ligh and dark mode
// this "function" was coppied from a yt video 

let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkMode=() => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}
const disableDarkMode=() => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', null)
}

if (darkmode ==="active") enableDarkMode()

themeSwitch.addEventListener("click",()=>{
    darkmode=localStorage.getItem('darkmode')
    darkmode !=="active" ? enableDarkMode(): disableDarkMode()
})
