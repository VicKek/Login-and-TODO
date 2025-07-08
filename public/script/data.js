class User {
    static _ID = 0;

    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.id = ++User._ID;
        this.tasks = [];
    }

    getUsername() { return this.username; }
    getPassword() { return this.password; }
    getEmail() { return this.email; }
    getID() { return this.id; }
    getTasks() { return this.tasks; }

    setUsername(newUsername) { this.username = newUsername; }
    setPassword(newPassword) { this.password = newPassword; }
    setEmail(newEmail) { this.email = newEmail; }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(taskID) {
        this.tasks = this.tasks.filter(task => task.id !== taskID);
    }
}

class Task {
    static _ID = 0;

    constructor(taskName) {
        this.id = ++Task._ID;
        this.taskName = taskName;
        this.completed = false;  
    }

    getTaskName() { return this.taskName; }
    isCompleted() { return this.completed; }

    setTaskName(taskName) { this.taskName = taskName; }
    setCompleted(status) { this.completed = status; }
}

let user1 = new User("john_doe", "password123", "john@example.com");
let task1 = new Task("Buy groceries");
let task2 = new Task("Finish homework");

user1.addTask(task1);
user1.addTask(task2);

let user2 = new User("jane_doe", "securePassword456", "jane@example.com");
let task3 = new Task("Clean the house");
let task4 = new Task("Go to the gym");

user2.addTask(task3);
user2.addTask(task4);

let users = [user1, user2];

let usersData = users.map(user => {
    return {
        id: user.getID(),
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword(),
        tasks: user.getTasks().map(task => ({
            id: task.id,
            taskName: task.getTaskName(),
            completed: task.isCompleted()
        }))
    };
});

let jsonData = JSON.stringify(usersData, null, 4);  // Pretty print with 4 spaces

function downloadJSON(data) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';  
    a.click();  
    URL.revokeObjectURL(url); 
}

downloadJSON(jsonData);
