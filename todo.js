// -----------------------------------------
//  Text Editing
// -----------------------------------------

function makeTextEditable(p) {
    p.addEventListener('click', () => {
        p.contentEditable = "true";
        p.classList.add('editing'); //needed for css 
        p.focus();
    });

    p.addEventListener('blur', () => {
        p.contentEditable = "false";
        p.classList.remove('editing'); //needed for css 
    });
}

// -----------------------------------------
//  Percentage Count
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


// -----------------------------------------
//  Add button
// -----------------------------------------
let addBtn = document.querySelector('.add-btn');
const todoList = document.querySelector('.todo-list');

function createTodoItem() {
    // Adding all the info needed for a complete todo-item

    const newItem = document.createElement('div');
    newItem.classList.add('todo-item');
    newItem.id=total+1; 

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change',updateCompletion)

    const taskText = document.createElement('p');
    taskText.classList.add('editable-text');
    makeTextEditable(taskText);
    taskText.textContent = `Task ${total + 1}`; 
    total += 1; 

    const deleteIcon = document.createElement('input');
    deleteIcon.classList.add("delete-bin")
    deleteIcon.type = 'image';
    deleteIcon.src = 'Images/redred.png';
    deleteIcon.alt = 'Delete Icon';
    deleteIcon.addEventListener('click',()=>{
        newItem.remove();
        updateCompletion();
    })


    newItem.appendChild(checkbox);
    newItem.appendChild(taskText);
    newItem.appendChild(deleteIcon);
    todoList.appendChild(newItem);

    updateCompletion();
}

addBtn.addEventListener('click', createTodoItem);


// Startup Functions 

// Makes all the Tasks Editable 
let editableTexts = document.querySelectorAll('.editable-text');
editableTexts.forEach(makeTextEditable);

updateCompletion();

// Addes Delete functionallity to pre existing Tasks 
// (used) before loading data from json
document.querySelectorAll('.todo-item').forEach(existingItem => {
    const deleteIcon = existingItem.querySelector('input[type="image"]');

    deleteIcon.addEventListener('click', () => {
        existingItem.remove();
        updateCompletion();
    });
});