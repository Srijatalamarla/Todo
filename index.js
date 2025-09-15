let tasks = JSON.parse(localStorage.getItem('tasks'))

function toggleModal() {
    document.getElementById('task-modal').classList.toggle('active')
}