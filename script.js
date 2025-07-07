// -----------------------------------------
//  Darkmode
// -----------------------------------------
let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

// Functions that enable and disable darkmode. 
// They just add and remove the darkmode class to the body tag
const enableDarkMode=() => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}
const disableDarkMode=() => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', null)
}

if (darkmode ==="active") enableDarkMode()

    // On click function 
themeSwitch.addEventListener("click",()=>{
    darkmode=localStorage.getItem('darkmode')
    darkmode !=="active" ? enableDarkMode(): disableDarkMode()
})

// -----------------------------------------
//  Text Editing
// -----------------------------------------
const editableTexts = document.querySelectorAll('.editable-text');

editableTexts.forEach(p => {
    p.addEventListener('click', () => {
        p.contentEditable = "true";
        p.classList.add('editing');
        p.focus();
    });

    p.addEventListener('blur', () => {
        p.contentEditable = "false";
        p.classList.remove('editing');
    });

});
