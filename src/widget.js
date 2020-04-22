const {BrowserWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const currWindow = require('electron').remote.getCurrentWindow();

console.log('Enter the Dragon ID:' + currWindow.webContents.id);

function resizeWindow() {
    const container = document.getElementById('root');
    currWindow.setSize(container.offsetWidth, container.offsetHeight);
}

let taskArray;  // Array for storing tasks.

// Getting Elements from HTML.
const progressBar = document.getElementById('ProgressBar');
const taskTimer = document.getElementById('TaskTimer');
const taskName = document.getElementById('TaskCell');
const taskDoneButton = document.getElementById('TaskDoneButton');

// Variables for use.
let currentTaskIndex = 1;   // task at 0th location would be loaded already.
let intervalID = null;      // ID return of the set interval method.
let taskCompleted = 0;

ipcRenderer.once('TaskArray', (event, arg) => {
    taskArray = arg;
    console.log(taskArray);
    CurrTask = taskArray[currentTaskIndex];
    taskName.innerHTML = CurrTask.name +" ["+ CurrTask.priority + "].";
    taskTimer.innerHTML = 0;
    intervalID =setInterval(() => {
        let current = taskTimer.innerHTML;
        taskTimer.innerHTML = parseInt(current,10) + 1;
    }, 1000);
});


taskDoneButton.addEventListener('click', (event) => {
    event.preventDefault();

    // Mark current task as done.
    taskArray[currentTaskIndex - 1].done = true;
    taskArray[currentTaskIndex - 1].timeConsumed = taskTimer.innerHTML;

    // Reset Timer.
    clearInterval(intervalID);
    taskTimer.innerHTML = 0;

    // Update Progress.
    taskCompleted += 1;
    progressBar.value = (taskCompleted / taskArray.length)*100;

    // Load next task into the view.
    CurrTask = taskArray[currentTaskIndex];
    taskName.innerHTML = CurrTask.name +" ["+ CurrTask.priority + "].";

    // Timer Update.
    intervalID = setInterval(() => {
        let current = taskTimer.innerHTML;
        taskTimer.innerHTML = parseInt(current,10) + 1;
    }, 1000);

})

