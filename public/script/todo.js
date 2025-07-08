const addBtn = document.querySelector('.add-btn');
const clearBtn = document.querySelector('.clear-btn');
const todoList = document.querySelector('.todo-list');
const compPerc = document.querySelector('.comp-perc');
const logoutBtn = document.querySelector('.logout');
total=0;
// -----------------------------------------
// Add Task
// -----------------------------------------
function createTodoItem(taskData = null) {
    const taskId = taskData ? taskData.id : ++total;

    const newItem = document.createElement('div');
    newItem.classList.add('todo-item');
    newItem.id = taskId;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = taskData ? taskData.completed : false;

    const taskText = document.createElement('p');
    taskText.classList.add('editable-text');
    taskText.textContent = taskData ? taskData.taskName : 'New Task';

    makeTextEditable(taskText);

    checkbox.addEventListener('change', () => {
        saveTask(taskId, taskText.textContent, checkbox.checked);
        updateCompletion();
    });

    const deleteIcon = document.createElement('input');
    deleteIcon.type = 'image';
    deleteIcon.src = 'Images/redred.png';
    deleteIcon.classList.add('delete-bin');
    deleteIcon.addEventListener('click', () => {
        newItem.remove();
        localStorage.removeItem(`task-${taskId}`);
        updateCompletion();
    });

    newItem.appendChild(checkbox);
    newItem.appendChild(taskText);
    newItem.appendChild(deleteIcon);
    document.querySelector('.todo-list').appendChild(newItem);

    if (!taskData) {
        saveTask(taskId, taskText.textContent, false);
    }

    updateCompletion();
}
function saveTask(id, name, completed) {
    const task = { id, taskName:name, completed };
    localStorage.setItem(`task-${id}`, JSON.stringify(task));
}
// -----------------------------------------
// Make Text Editable
// -----------------------------------------
function makeTextEditable(p) {
    p.addEventListener('click', () => {
        p.contentEditable = "true";
        p.classList.add('editing');
        p.focus();
    });

    p.addEventListener('blur', () => {
        p.contentEditable = "false";
        p.classList.remove('editing');

        const parent = p.closest('.todo-item');
        const taskId = parseInt(parent.id);
        const checkbox = parent.querySelector('input[type="checkbox"]');
        saveTask(taskId, p.textContent, checkbox.checked);
    });
}
addBtn.addEventListener('click', () => createTodoItem())
// -----------------------------------------
// Load tasks from localStorage
// -----------------------------------------
// Total is for IDs
function loadTasksFromLocalStorage() {
    for (let key in localStorage) {
        if (key.startsWith("task-")) {
            const taskData = JSON.parse(localStorage.getItem(key));
            total++;
            if (taskData) {
                createTodoItem(taskData);
            }
        }
    }
}
// -----------------------------------------
// Load tasks from file
// -----------------------------------------
function loadTasks() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("You must log in to access your tasks.");
        window.location.href = "login.html"; 
        return;
    }

    // Here I assume that is there are tasks in the local storage
    // the user is logged in 
    let userHasTasks = false;
    for (let key in localStorage) {
        if (key.startsWith("task-")) {
            userHasTasks = true;
            break;
        }
    }

    if (!userHasTasks && loggedInUser.tasks) {
        for (let task of loggedInUser.tasks) {
            localStorage.setItem(`task-${task.id}`, JSON.stringify(task));
        }
    }

    loadTasksFromLocalStorage();
}
// -----------------------------------------
// Update Completion Counter
// -----------------------------------------
function updateCompletion() {
    const checkboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');
    const total = checkboxes.length;
    let checkedCount = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
    });

    const percentage = total === 0 ? 0 : Math.round((checkedCount / total) * 100);
    compPerc.textContent = `${checkedCount}/${total} (${percentage}%)`;
    compPerc.style.fontWeight = 'bold';
}
// -----------------------------------------
// Clear All Tasks
// -----------------------------------------
clearBtn.addEventListener('click', () => {
    for (let key in localStorage) {
        if (key.startsWith("task-")) {
            localStorage.removeItem(key);
        }
    }
    todoList.innerHTML = '';
    updateCompletion();
});
function logout(){
    for (let key in localStorage) {
        if (key.startsWith("task-")) {
            localStorage.removeItem(key);
        }
    }
    todoList.innerHTML = '';
    localStorage.removeItem('loggedInUser')
    updateCompletion();
    window.location.href='login.html'
}
logoutBtn.addEventListener('click',()=>logout())
// -----------------------------------------
// Initial Load
// -----------------------------------------
loadTasks();
