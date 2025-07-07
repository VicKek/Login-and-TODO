// -----------------------------------------
//  Text Editing
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

        // Save edited name to localStorage
        const parent = p.closest('.todo-item');
        const taskId = parseInt(parent.id);
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        const task = loggedInUser.tasks.find(t => t.id === taskId);
        if (task) {
            task.taskName = p.textContent;
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        }
    });
}

// -----------------------------------------
//  Percentage Count
// -----------------------------------------

const compPerc = document.querySelector('.comp-perc');
const todoList = document.querySelector('.todo-list');
let total = 0;

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
//  Add Task
// -----------------------------------------

let addBtn = document.querySelector('.add-btn');

function createTodoItem(taskData = null) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    const taskId = taskData ? taskData.id : Date.now();

    const newItem = document.createElement('div');
    newItem.classList.add('todo-item');
    newItem.id = taskId;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = taskData ? taskData.completed : false;
    checkbox.addEventListener('change', () => {
        const task = loggedInUser.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = checkbox.checked;
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        }
        updateCompletion();
    });

    const taskText = document.createElement('p');
    taskText.classList.add('editable-text');
    taskText.textContent = taskData ? taskData.taskName : `New Task`;
    makeTextEditable(taskText);

    const deleteIcon = document.createElement('input');
    deleteIcon.classList.add("delete-bin");
    deleteIcon.type = 'image';
    deleteIcon.src = 'Images/redred.png';
    deleteIcon.alt = 'Delete Icon';
    deleteIcon.addEventListener('click', () => {
        newItem.remove();
        const taskIndex = loggedInUser.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            loggedInUser.tasks.splice(taskIndex, 1);
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        }
        updateCompletion();
    });

    newItem.appendChild(checkbox);
    newItem.appendChild(taskText);
    newItem.appendChild(deleteIcon);
    todoList.appendChild(newItem);

    if (!taskData) {
        const newTask = {
            id: taskId,
            taskName: taskText.textContent,
            completed: false
        };
        loggedInUser.tasks = loggedInUser.tasks || [];
        loggedInUser.tasks.push(newTask);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    }

    total++;
    updateCompletion();
}

addBtn.addEventListener('click', () => createTodoItem());

// -----------------------------------------
//  Load Tasks from Data file
// -----------------------------------------

async function loadTasksFromJSON() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || !loggedInUser.id) {
        alert("No user is logged in.");
        return;
    }

    try {
        const response = await fetch("users_data.json");
        const users = await response.json();
        // "online" user
        const user = users.find(u => u.id === loggedInUser.id);

        if (!user || !user.tasks) {
            alert("User or tasks not found.");
            return;
        }

        // Optional: sync JSON tasks into localStorage
        loggedInUser.tasks = user.tasks;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        loggedInUser.tasks.forEach(task => {
            createTodoItem(task);
        });

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

loadTasksFromJSON();
