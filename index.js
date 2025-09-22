let tasks = JSON.parse(localStorage.getItem('tasks')) || []
let taskModal = document.getElementById('task-modal-container')
let formMode = "add"

function toggleTaskModal(mode) {
    console.log(mode)
    let submitTaskBtn = document.getElementById('submitTaskBtn')
    if(mode === 'add') {
        taskModal.classList.add('active')
        submitTaskBtn.value = "Create New Task"
        formMode = "add"
    }
    else if(mode === 'update') {
        taskModal.classList.add('active')
        submitTaskBtn.value = "Update Task"
        formMode = "update"
    }
    else if(mode === 'close') {
        taskModal.classList.remove('active')
        document.getElementById('task-modal-form').reset()
    }
}


document.getElementById('submitTaskBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if(formMode === "add")   addNewTask();
    if(formMode === "update")   updateTask();
});


function addNewTask() {
    console.log("ADD NEW TASK")

    let taskTitle = document.getElementById('taskTitle').value;
    let taskDesc = document.getElementById('taskDesc').value;
    let taskDeadline = document.getElementById('taskDeadline').value;


    console.log(taskTitle)
    console.log(taskDesc)
    console.log(taskDeadline)

    if(taskTitle === "") {
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


function updateTask() {
    console.log("UPDATE TASK")
}

const saveTask = function(task) {
    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    console.log("SAVED")
}

const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
    