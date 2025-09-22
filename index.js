let tasks = JSON.parse(localStorage.getItem('tasks')) || []
const taskModal = document.getElementById('task-modal-container')
let formMode = "add"

document.addEventListener('DOMContentLoaded', loadTasks)

function toggleTaskModal(mode) {
    console.log(mode)
    console.log(tasks.length)
    const submitTaskBtn = document.getElementById('submitTaskBtn')
    if (mode === 'add') {
        taskModal.classList.add('active')
        submitTaskBtn.value = "Create New Task"
        formMode = "add"
    }
    else if (mode === 'update') {
        taskModal.classList.add('active')
        submitTaskBtn.value = "Update Task"
        formMode = "update"
    }
    else if (mode === 'close') {
        taskModal.classList.remove('active')
        document.getElementById('task-modal-form').reset()
    }
}


document.getElementById('submitTaskBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (formMode === "add") addNewTask();
    if (formMode === "update") updateTask();
});


function addNewTask() {
    console.log("ADD NEW TASK")

    const taskTitle = document.getElementById('taskTitle').value;
    const taskDesc = document.getElementById('taskDesc').value;
    const taskDeadline = document.getElementById('taskDeadline').value;


    console.log(taskTitle)
    console.log(taskDesc)
    console.log(taskDeadline)

    if (taskTitle === "") {
        alert("Please enter title of your task")
        return;
    }

    let newTask = {
        id: uid(),
        title: taskTitle,
        description: taskDesc,
        deadline: taskDeadline,
        createdAt: Date.now(),
        completed: false
    }

    console.log(newTask)
    saveTask(newTask)

    toggleTaskModal('close')
}

function loadTasks() {
    const addTaskContainer = document.getElementById("add-task-container")
    const tasksContainer = document.getElementById('tasks-container')

    if (tasks.length === 0) {

        console.log("no elements")
        console.log(addTaskContainer)
        console.log(tasksContainer)

        addTaskContainer.classList.add('large')
        tasksContainer.style.display = 'none'
    }
    else {
        addTaskContainer.classList.remove('large')
        tasksContainer.style.display = 'block'

        const tasksList = document.querySelector('task-items-list')
        tasks.array.forEach(element => {
            console.log(element)
        });
    }
}

function updateTask() {
    console.log("UPDATE TASK")
}

const saveTask = function (task) {
    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    console.log("SAVED")
}

const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

