let tasks = JSON.parse(localStorage.getItem('tasks')) || []
const taskModal = document.getElementById('task-modal-container')
let formMode = "add"
let currFilter = "all"

//event listeners
document.addEventListener('DOMContentLoaded', loadTasks(currFilter))

document.querySelectorAll(".task-selector").forEach(selector => {
    // console.log(selector.getAttribute('data-id'))
    selector.addEventListener('click', () => {
        currFilter = selector.getAttribute('data-id')
        loadTasks(currFilter)
    })
})

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
    loadTasks(currFilter)
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
    loadTasks(currFilter)
    toggleTaskModal('close')
}

function loadTasks(filter) {
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
        console.log(filter)
        console.log(filteredTasks)
        console.log(tasks)

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li')
            taskItem.innerHTML =
                `
                <p class="task-item-title">${task.title}</p>
                <p class="task-item-desc">${task.description}</p>
                <p class="task-item-deadline">${task.deadline}</p>
                <p class="task-item-completed">${task.completed}</p>
                <button class="task-item-btn" id="task-completion-btn">Completed</button>
                <button class="task-item-btn" id="task-edit-btn">Edit</button>
                <button class="task-item-btn" id="task-delete-btn">Delete</button>
            `
            taskItem.classList.add('task-item')
            taskItem.setAttribute('data-id', `${task.id}`)

            tasksList.append(taskItem)
        });
    }
}

function updateTask() {
    console.log("UPDATE TASK")
}

const toggleCompletion = function (taskId) {
    console.log(taskId)
    let taskIndex = tasks.findIndex(task => task.id === taskId)
    let taskCompleted = tasks[taskIndex].completed
    tasks[taskIndex].completed = !taskCompleted
    loadTasks(currFilter)
}
const saveTask = function (task) {
    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    console.log("SAVED")
}

const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

