let tasks = JSON.parse(localStorage.getItem('tasks')) || []
const taskModal = document.getElementById('task-modal-container')
let formMode = "add"
let currFilter = "all"

//event listeners
document.addEventListener('DOMContentLoaded', loadTasks(currFilter))

document.querySelectorAll(".task-selector").forEach(selector => {
    selector.addEventListener('click', () => {
        currFilter = selector.getAttribute('data-id')
        loadTasks(currFilter)
    })
})

function toggleTaskModal(mode, event) {

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
        let taskId = event.target.parentElement.dataset.id
        populateFields(taskId)

        document.getElementById('submitTaskBtn').addEventListener('click', (e) => {
            e.preventDefault();
            updateTask(taskId)    
        });
    }
    else if (mode === 'close') {
        taskModal.classList.remove('active')
        document.getElementById('task-modal-form').reset() //clear all fields in form
    }
    loadTasks(currFilter)
}


document.getElementById('submitTaskBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (formMode === "add") addNewTask();
});


function addNewTask() {

    const taskTitle = document.getElementById('taskTitle').value;
    const taskDesc = document.getElementById('taskDesc').value;
    const taskDeadline = document.getElementById('taskDeadline').value;

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
    tasks.push(newTask)

    saveTasks(tasks)
    toggleTaskModal('close')
}

function loadTasks(filter) {
    const addTaskContainer = document.getElementById("add-task-container")
    const tasksContainer = document.getElementById('tasks-container')

    if (tasks.length === 0) {

        addTaskContainer.classList.add('large')
        tasksContainer.style.display = 'none'
    }
    else {
        addTaskContainer.classList.remove('large')
        tasksContainer.style.display = 'block'

        const tasksList = document.querySelector('.task-items-list')
        tasksList.innerHTML = ``; // clear

        let filteredTasks = [...tasks]

        //filter if any
        if (filter === "pending") {
            filteredTasks = tasks.filter(task => task.completed === false)
        }
        else if (filter === "completed") {
            filteredTasks = tasks.filter(task => task.completed === true)
        }

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li')
            taskItem.innerHTML =
                `
                <p class="task-item-title">${task.title}</p>
                <p class="task-item-desc">${task.description}</p>
                <p class="task-item-deadline">${task.deadline}</p>
                <p class="task-item-completed">${task.completed}</p>
                <button class="task-item-btn" id="task-completion-btn" onclick="toggleCompletion(event)">Completed</button>
                <button class="task-item-btn" id="task-edit-btn" onclick="toggleTaskModal('update', event)">Edit</button>
                <button class="task-item-btn" id="task-delete-btn" onclick="deleteTask(event)">Delete</button>
            `
            taskItem.classList.add('task-item')
            taskItem.setAttribute('data-id', `${task.id}`)

            tasksList.append(taskItem)
        });
    }
}

function updateTask(taskId) {

    const updatedTaskTitle = document.getElementById('taskTitle').value;
    const updatedTaskDesc = document.getElementById('taskDesc').value;
    const updatedTaskDeadline = document.getElementById('taskDeadline').value;

    let task = tasks[tasks.findIndex(task => task.id === taskId)]

    task.title = updatedTaskTitle
    task.description = updatedTaskDesc
    task.deadline = updatedTaskDeadline

    saveTasks(tasks)
    toggleTaskModal('close')
}

function populateFields(taskId) {

    let task = tasks[tasks.findIndex(task => task.id === taskId)]

    const taskTitleElem = document.getElementById('taskTitle');
    const taskDescElem = document.getElementById('taskDesc');
    const taskDeadlineElem = document.getElementById('taskDeadline');

    taskTitleElem.value = task.title
    taskDescElem.value = task.description
    taskDeadlineElem.value = task.deadline

}

function deleteTask(e) {
    let taskId = e.target.parentElement.dataset.id
    tasks = tasks.filter(task => task.id !== taskId)
    saveTasks(tasks)
    loadTasks(currFilter)
}

const toggleCompletion = function (e) {
    let taskId = e.target.parentElement.dataset.id
    let taskIndex = tasks.findIndex(task => task.id === taskId)
    let taskCompleted = tasks[taskIndex].completed
    tasks[taskIndex].completed = !taskCompleted
    loadTasks(currFilter)
}


const saveTasks = function (tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

