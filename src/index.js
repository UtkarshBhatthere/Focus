const {BrowserWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const currWindow = require('electron').remote.getCurrentWindow();

// TODO: Fix UI to be better and Soothing.
// TODO: Add timer to the TODO console.

function resizeWindow() {
    const container = document.getElementById('mainBox');
    currWindow.setSize(container.offsetWidth, container.offsetHeight);
}

resizeWindow();

function task(name, priority) {
    this.name = name;
    this.priority = priority;
    this.timeConsumed = null;
    this.done = false;
    return this;
}

// Array to store out Tasks.
let taskArray = new Array;

// Get Buttons.
let AddTaskButton = document.getElementById('TaskSubmitButton');
let StartFocusButton = document.getElementById('StartFocusButton');

// Get Form Inputs.

let TaskForm = document.getElementById('TaskForm');
let Task = document.getElementById('Task');
let Priority = document.getElementById('Priority')

// Get output Table.
let TaskShowTable = document.getElementById('TaskShowTable');

function renderTable(item) {
    let newRow = TaskShowTable.insertRow(TaskShowTable.rows.length);
    newRow.insertCell(0).innerHTML = item.name;
    newRow.insertCell(1).innerHTML = item.priority;
}


AddTaskButton.addEventListener('click', (event) => {
    event.preventDefault();

    // Creating New task object.
    let newTask = new task(Task.value, Priority.value);

    // Inserting the object to Array and storing to local storage.
    taskArray.push(newTask);

    // Show Newly added task to Output Table.
    renderTable(newTask);
    resizeWindow();
    TaskForm.reset();
})

StartFocusButton.addEventListener('click', () => {
    event.preventDefault();

    // Create new window.
    let widgetWin = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
        frame: true,
        width: 300,
        height: 200
    });

    // Load file.
    widgetWin.loadFile("./src/widget.html");

    widgetWin.once('show', () => {
        ipcRenderer.sendTo(widgetWin.webContents.id,'TaskArray', taskArray);
        currWindow.close();
    })

    widgetWin.once('ready-to-show', () => {
        widgetWin.show();
    })
})