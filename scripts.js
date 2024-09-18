// Get elements from the DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let editMode = false;
let editTaskElement;

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Add task event
taskForm.addEventListener('submit', addTask);

// Add Task Function
function addTask(e) {
    e.preventDefault();

    if (editMode) {
        // Edit existing task
        editTaskElement.firstChild.textContent = taskInput.value;
        updateTaskInLocalStorage(editTaskElement.firstChild.textContent);
        showNotification('Task updated successfully!', 'success');
        editMode = false;
        editTaskElement = null;
    } else {
        // Create new task
        const taskText = taskInput.value;
        const li = createTaskElement(taskText);

        // Append task to list
        taskList.appendChild(li);

        // Store task in localStorage
        storeTaskInLocalStorage(taskText);

        showNotification('Task added successfully!', 'success');
    }

    // Clear input
    taskInput.value = '';
}

// Create Task Element
function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center mb-2';
    li.appendChild(document.createTextNode(taskText));

    // Add edit button to task
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-warning btn-sm edit-task mr-2';
    editBtn.appendChild(document.createTextNode('Edit'));
    li.appendChild(editBtn);
    editBtn.addEventListener('click', editTask);

    // Add delete button to task
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm delete-task';
    deleteBtn.appendChild(document.createTextNode('Delete'));
    li.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', deleteTask);

    // Add event listener for mark complete
    li.addEventListener('dblclick', toggleTaskCompletion);

    return li;
}

// Edit Task Function
function editTask(e) {
    editMode = true;
    editTaskElement = e.target.parentElement;
    taskInput.value = editTaskElement.firstChild.textContent;
}

// Delete Task Function
function deleteTask(e) {
    const li = e.target.parentElement;
    taskList.removeChild(li);

    // Remove from localStorage
    removeTaskFromLocalStorage(li.firstChild.textContent);
    showNotification('Task deleted successfully!', 'danger');
}

// Toggle Task Completion
function toggleTaskCompletion(e) {
    e.target.classList.toggle('completed');
}

// Store Task in Local Storage
function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load Tasks from Local Storage
function loadTasksFromLocalStorage() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task) {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });
}

// Remove Task from Local Storage
function removeTaskFromLocalStorage(taskContent) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task, index) {
        if (task === taskContent) {
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update Task in Local Storage
function updateTaskInLocalStorage(updatedTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    const index = tasks.indexOf(editTaskElement.firstChild.textContent);
    if (index !== -1) {
        tasks[index] = updatedTask;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Show Notification

function showNotification(message, type) {
    // تحقق لو فيه إشعار موجود بالفعل وقم بإزالته
    const existingNotification = document.querySelector('.alert');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.appendChild(document.createTextNode(message));
    document.getElementById('notification-container').appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => notification.remove(), 3000);
}
