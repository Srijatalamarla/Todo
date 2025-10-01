let tasks = JSON.parse(localStorage.getItem('tasks')) || []
const taskModal = document.getElementById('task-modal-container')
const viewModal = document.querySelector('.view-task-modal-container')
let currFilter = "all"

//event listeners
document.addEventListener('DOMContentLoaded', () => {
    addActiveStyle(currFilter)
    loadTasks(currFilter)
})

document.addEventListener('click', (e) => {
    if (taskModal && e.target === taskModal) {
        taskModal.classList.remove('active')
        document.getElementById('task-modal-form').reset() //clear all fields in form if any
    }
    if (viewModal && e.target === viewModal) {
        viewModal.classList.remove('active')
    }
})

document.querySelectorAll(".task-selector").forEach(selector => {
    selector.addEventListener('click', () => {
        currFilter = selector.getAttribute('data-id')
        addActiveStyle(currFilter)
        loadTasks(currFilter)
    })
})

const addActiveStyle = (filter) => {
    //add active style for task selector
    document.querySelectorAll('.task-selector').forEach(selector => {
        if (selector.dataset.id === filter)
            selector.classList.add('active')
        else
            selector.classList.remove('active')
    })
}

function toggleTaskModal(mode, taskId) {

    const addTaskBtn = document.getElementById('modal-addTaskBtn')
    const updateTaskBtn = document.getElementById('modal-updateTaskBtn')

    if (mode === 'add') {
        taskModal.classList.add('active')
        addTaskBtn.style.display = 'block'
        updateTaskBtn.style.display = 'none'
    }
    else if (mode === 'update') {
        taskModal.classList.add('active')
        addTaskBtn.style.display = 'none'
        updateTaskBtn.style.display = 'block'

        populateFields(taskId)

        updateTaskBtn.onclick = (e) => {
            e.preventDefault();
            updateTask(taskId)
        };
    }
    else if (mode === 'close') {
        taskModal.classList.remove('active')
        document.getElementById('task-modal-form').reset() //clear all fields in form
    }
    loadTasks(currFilter)
}

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

    alert('Task added successfully')
}

function loadTasks(filter) {
    const addTaskContainer = document.getElementById("add-task-container")
    const tasksContainer = document.getElementById('tasks-container')
    const mainTitleContainer = document.querySelector('.main-title-container')

    if (tasks.length === 0) {
        addTaskContainer.classList.add('large', 'dashed')
        tasksContainer.style.display = 'none'
        mainTitleContainer.style.display = 'block'
    }
    else {
        addTaskContainer.classList.remove('large', 'dashed')
        tasksContainer.style.display = 'block'
        mainTitleContainer.style.display = 'flex'

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
                <p class="task-item-title" onclick="viewTaskModal('${task.id}')">${task.title.substring(0, 30) + '...'} <i class="fa-solid fa-arrow-up-right-from-square"></i></p>
                <div class="task-details">
                    <p class="task-item-desc">
                        <i class="fa-regular fa-clipboard"></i>   ${!task.description ? "---" : task.description.substring(0, 30) + ' ...'}
                    </p>
                    <p class="task-item-deadline">
                        <i class="fa-solid fa-calendar-day"></i>  ${!task.deadline ? "---" : convertDateToWords(task.deadline)}
                    </p>
                </div>
                <div class="task-item-btn-container">
                    <button type="button" class="task-item-btn" id="task-completion-btn" onclick="toggleCompletion('${task.id}')">
                        ${task.completed === true ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-check"></i>'}
                    </button>
                    <button type="button" class="task-item-btn" id="task-edit-btn" onclick="toggleTaskModal('update', '${task.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button type="button" class="task-item-btn" id="task-delete-btn" onclick="if(confirm('Are you sure to delete this task ?')) deleteTask('${task.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `
            taskItem.classList.add('task-item')
            if (filter === "all") {
                //all items 
                // adding completed class to item - so that completed and pending tasks are differentiated when on all items page
                taskItem.classList.add(task.completed ? 'completed' : 'pending')
            }
            taskItem.setAttribute('data-id', `${task.id}`)

            tasksList.append(taskItem)
        });

        if(filteredTasks.length === 0) {
            tasksList.innerHTML = 
            `
                <p class="no-items">No ${filter} tasks</p>
            `
        }
    }
}

function updateTask(taskId) {

    const updatedTaskTitle = document.getElementById('taskTitle').value;
    const updatedTaskDesc = document.getElementById('taskDesc').value;
    const updatedTaskDeadline = document.getElementById('taskDeadline').value;

    let task = tasks.find(task => task.id === taskId)



    task.title = updatedTaskTitle
    task.description = updatedTaskDesc
    task.deadline = updatedTaskDeadline

    saveTasks(tasks)
    toggleTaskModal('close')
    alert('Task updated successfully')
}

function viewTaskModal(taskId) {
    console.log("View task")

    const task = tasks.find((task) => task.id === taskId)
    console.log(task)

    viewModal.classList.add('active')
    viewModal.innerHTML = `` //clear previous task

    const viewTaskModal = document.createElement('div')

    viewTaskModal.innerHTML =
        `
        <div class="task-modal-header">
            <p class="task-title">${task.title}</p>
            <button type="button" id="closeBtn" onclick="viewModal.classList.remove('active')"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="task-details">
            <p class="task-desc">
                <i class="fa-regular fa-clipboard"></i>   ${!task.description ? "---" : task.description}
            </p>
            <p class="task-deadline">
                <i class="fa-solid fa-calendar-day"></i>  ${!task.deadline ? "---" : convertDateToWords(task.deadline)}
            </p>
            <p class="task-completion">
                ${task.completed ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>'} completion
            </p>
        </div>
        <div class="task-btn-container">
            <button type="button" onclick="viewModal.classList.remove('active')">Close</button>
        </div>
    `

    viewTaskModal.classList.add('view-task-modal')
    viewModal.appendChild(viewTaskModal)
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

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId)
    saveTasks(tasks)
    loadTasks(currFilter)
}

const toggleCompletion = function (taskId) {
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

const convertDateToWords = (date) => {
    var dateArr = new Date(date).toString().split(' ').slice(1, 4)
    return dateArr[1] + ' ' + dateArr[0] + ' ' + dateArr[2]
}