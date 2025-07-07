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


// -----------------------------------------
//  Checkbox Count
// -----------------------------------------
const compPerc = document.querySelector('.comp-perc');
let checkboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');
let total = checkboxes.length;

// Counts how many checkboxes there are, 
// counts how many are clicked, and shows the results
function updateCompletion() {
    checkboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');
    let total = checkboxes.length;
    let checkedCount = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
    });

    let percentage = total === 0 ? 0 : Math.round((checkedCount / total) * 100);
    compPerc.textContent = `${checkedCount}/${total} (${percentage}%)`;
    compPerc.style.fontWeight='bold';
}

checkboxes.forEach(cb => {
    cb.addEventListener('change', updateCompletion);
});

// This funciton runs "on startup"
updateCompletion();



// -----------------------------------------
//  Add button
// -----------------------------------------
let addBtn = document.querySelector('.add-btn');
const todoList = document.querySelector('.todo-list');

function createTodoItem() {
    const newItem = document.createElement('div');
    newItem.classList.add('todo-item'); 

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change',updateCompletion)

    const taskText = document.createElement('p');
    taskText.classList.add('editable-text');
    taskText.textContent = `Task ${total + 1}`; 
    total += 1; 

    const deleteIcon = document.createElement('input');
    deleteIcon.type = 'image';
    deleteIcon.src = 'Images/redred.png';
    deleteIcon.alt = 'Delete Icon';

    newItem.appendChild(checkbox);
    newItem.appendChild(taskText);
    newItem.appendChild(deleteIcon);
    todoList.appendChild(newItem);

    updateCompletion();
}

addBtn.addEventListener('click', createTodoItem);

