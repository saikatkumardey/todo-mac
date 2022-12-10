const electronStore = require('electron-store');
const store = new electronStore();


const form = document.getElementById('add-task-form');
const input = document.getElementById('new-task-input');
const tasksList = document.getElementById('tasks-list');

// TODO: move the done task to the bottom
// TODO: show due date

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', handleTaskClick);
tasksList.addEventListener('keydown', handleTaskKeyDown);


function init() {

    // Get the todo list data from the store
    let todoList = store.get('todoList') || [];

    if (todoList == []) {
        return;
    }

    // Get the container element where the todo list will be inserted
    const todoListContainer = document.getElementById('tasks-list');

    // Loop through the todo list items and create HTML elements for each one
    for (const todoItem of todoList) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
        <span>${todoItem.task}</span>
        <button class="complete-button">Done</button>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
      `;;
        todoListContainer.appendChild(listItem);
    }
}

function completeTask(event) {
    // Get the task text from the event target
    const taskText = event.target.innerText;

    // Get the todo list from the store
    const todoList = store.get('todoList');

    // Find the index of the task to complete
    const taskIndex = todoList.findIndex(task => task.task === taskText);

    // Mark the task as completed
    todoList[taskIndex].completed = true;

    // Add the "completed" class to the task element to strike through the text
    event.target.classList.add('completed');

    // Save the updated todo list to the store
    store.set('todoList', todoList);
}



function addTask(event) {

    event.preventDefault();

    const task = input.value;
    if (!task) return;

    const newTask = document.createElement('li');
    newTask.innerHTML = `
    <span>${task}</span>
    <button class="complete-button">Done</button>
    <button class="edit-button">Edit</button>
    <button class="delete-button">Delete</button>
  `;

    tasksList.appendChild(newTask);

    console.log("appended task");

    const todoList = store.get('todoList') || [];
    todoList.push({ task: task, completed: false });
    store.set('todoList', todoList);

    input.value = '';
}

function handleTaskKeyDown(event) {
    if (event.key !== 'Enter') return;

    const taskInput = event.target;
    const task = taskInput.parentElement;

    saveTask(task);
}

function handleTaskClick(event) {
    const clickedElement = event.target;
    const task = clickedElement.parentElement;

    if (clickedElement.classList.contains('edit-button')) {
        editTask(task);
    } else if (clickedElement.classList.contains('delete-button')) {
        deleteTask(task);
    }
    else if (clickedElement.classList.contains('save-button')) {
        saveTask(task);
    }
    else if (clickedElement.classList.contains('complete-button')) {
        completeTask(task);
    }
}


function saveTask(task) {
    const taskInput = task.firstElementChild;
    const taskValue = taskInput.value;
    if (!taskValue) return;

    const taskSpan = document.createElement('span');
    taskSpan.innerText = taskValue;

    // Get the task text from the event target
    const taskText = event.target.innerText;

    // Get the todo list from the store
    const todoList = store.get('todoList');

    // Find the index of the task to complete
    const taskIndex = todoList.findIndex(task => task.task === taskText);

    // Mark the task as completed
    todoList[taskIndex].task = taskValue;

    // Save the updated todo list to the store
    store.set('todoList', todoList);


    task.replaceChild(taskSpan, taskInput);
    task.querySelector('.save-button').innerText = 'Edit';
    task.querySelector('.save-button').classList.add('edit-button');
    task.querySelector('.save-button').classList.remove('save-button');
}

function editTask(task) {
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.value = task.firstElementChild.innerText;

    task.replaceChild(taskInput, task.firstElementChild);
    task.querySelector('.edit-button').innerText = 'Save';
    task.querySelector('.edit-button').classList.add('save-button');
    task.querySelector('.edit-button').classList.remove('edit-button');
}


function deleteTask(task) {
    task.remove();
}


window.onload = function () {
    // Call the init() function to load the todo list data
    init();
};