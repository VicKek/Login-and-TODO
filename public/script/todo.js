const addBtn = document.querySelector('.add-btn');
const clearBtn = document.querySelector('.clear-btn');
const todoList = document.querySelector('.todo-list');
const compPerc = document.querySelector('.comp-perc');
const logoutBtn = document.querySelector('.logout');
let total = 0;

// -----------------------------------------
// Add Task
// -----------------------------------------
function createTodoItem(taskData = null) {

    // These are the data that are placed for every task item
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
        syncTasksToServer();
    });
    const deleteIcon = document.createElement('input');
    deleteIcon.type = 'image';
    deleteIcon.src = 'Images/redred.png';
    deleteIcon.classList.add('delete-bin');
    deleteIcon.addEventListener('click', () => {
        newItem.remove();
        localStorage.removeItem(`task-${taskId}`);
        updateCompletion();
        syncTasksToServer();
    });

    // Place them all in the new Item
    newItem.appendChild(checkbox);
    newItem.appendChild(taskText);
    newItem.appendChild(deleteIcon);
    document.querySelector('.todo-list').appendChild(newItem);

    if (!taskData) {
        saveTask(taskId, taskText.textContent, false);
        syncTasksToServer();
    }

    updateCompletion();
}

function saveTask(id, name, completed) {
    const task = { id, taskName: name, completed };
    localStorage.setItem(`task-${id}`, JSON.stringify(task));
    updateLoggedInUserTasks();
}

function updateLoggedInUserTasks() {
    const tasks = [];
    for (let key in localStorage) {
        if (key.startsWith("task-")) {
            const taskData = JSON.parse(localStorage.getItem(key));
            if (taskData) tasks.push(taskData);
    }
    }
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        loggedInUser.tasks = tasks;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }
}

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
        syncTasksToServer();
    });

}

addBtn.addEventListener('click', () => createTodoItem());

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

function loadTasks() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // This is for the secure part (After a user is logoued out)
    // The local stoage is reset and you can't access the todo list via: localhost:3000/todo.html
    if (!loggedInUser) {
        alert("You must log in to access your tasks.");
        window.location.href = "index.html";
        return;
    }

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

function updateCompletion() {
    const checkboxes = document.querySelectorAll('.todo-item input\[type="checkbox"]');
    const total = checkboxes.length;
    let checkedCount = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
    });

    const percentage = total === 0 ? 0 : Math.round((checkedCount / total) * 100);
    compPerc.textContent = `${checkedCount}/${total} (${percentage}%)`;
    compPerc.style.fontWeight = 'bold';


}

clearBtn.addEventListener('click', () => {
    for (let key in localStorage) {
        if (key.startsWith("task-")) {
            localStorage.removeItem(key);
        }
    }
    todoList.innerHTML = '';
    updateLoggedInUserTasks();
    updateCompletion();
    syncTasksToServer();
});

function logout() {
    for (let key in localStorage) {
      if (key.startsWith("task-")) {
        localStorage.removeItem(key);
        }
    }
    todoList.innerHTML = '';
    localStorage.removeItem('loggedInUser');
    updateCompletion();
    window.location.href = 'index.html';
}

function syncTasksToServer() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) return;

    fetch('/api/users')
        .then(res => res.json())
        .then(users => {
            const userIndex = users.findIndex(u => u.id === loggedInUser.id);
            if (userIndex !== -1) {
                users[userIndex].tasks = loggedInUser.tasks;
                return fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(users)
                });
            }
        })
        .catch(console.error);
}

logoutBtn.addEventListener('click', () => logout());

loadTasks();

