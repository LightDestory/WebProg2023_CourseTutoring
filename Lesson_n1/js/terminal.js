// Terminal Spawn Setup
const spawner = document.querySelector('#spawner button');
spawner.addEventListener('click', spawnTerminal);
var terminalCounter = 0;

// Box shadow settings
const box_shadow_settings = "1px 1px 15px black"

// Command Regex,  gets the first word and the rest of the string
const command_regex = /^([\w]+)(\s.+?)?$/;

// Drag and drop variables
var isMouseDown = false;
var firstDown = true;
var mouseX;
var mouseY;
var elementX;
var elementY;


function spawnTerminal() {
    // Get the body element
    let body = document.querySelector('body');

    // Create the terminal window with a specific id and a random offset
    let terminal = document.createElement('div');
    let offsetX = Math.floor(Math.random() * 200);
    let offsetY = Math.floor(Math.random() * 200);
    terminal.classList.add('terminal_window');
    terminal.setAttribute('draggable', 'true');
    terminal.setAttribute('id', 'terminal_' + terminalCounter);
    terminal.style.left = offsetX + 'px';
    terminal.style.top = offsetY + 'px';

    // Create the title bar and the buttons
    let titleBar = document.createElement('div');
    titleBar.classList.add('title_bar');
    let buttons = document.createElement('div');
    buttons.classList.add('buttons');
    let closeButton = document.createElement('span');
    closeButton.classList.add('terminal_close_btn');
    closeButton.innerHTML = 'X';
    closeButton.dataset.id = terminalCounter;
    let hideButton = document.createElement('span');
    hideButton.classList.add('terminal_hide_btn');
    hideButton.innerHTML = '_';
    hideButton.dataset.id = terminalCounter;

    // Create the content div and the user prompt div
    let content = document.createElement('div');
    content.classList.add('content');
    let userInput = document.createElement('div');
    userInput.classList.add('user_prompt');
    userInput.setAttribute('contenteditable', 'true');
    userInput.focus();

    // Binding elements to the terminal
    titleBar.appendChild(buttons);
    buttons.appendChild(closeButton);
    buttons.appendChild(hideButton);
    content.appendChild(userInput);
    terminal.appendChild(titleBar);
    terminal.appendChild(content);

    // Binding the terminal to the body
    body.appendChild(terminal);

    // Binding the events
    titleBar.addEventListener('mousedown', onMouseDown);
    titleBar.addEventListener('mouseup', onMouseUp);
    titleBar.addEventListener('mousemove', onMouseMove);
    titleBar.addEventListener('mouseleave', onMouseUp);
    closeButton.addEventListener('click', onCloseClick);
    hideButton.addEventListener('click', onHideClick);
    userInput.addEventListener('keypress', onCommandSubmit);

    // Increment the counter
    terminalCounter++;
}

function onCloseClick(event) {
    let terminal = document.querySelector('#terminal_' + event.target.dataset.id);
    document.querySelector('body').removeChild(terminal);
}

function onHideClick(event) {
    let terminal = document.querySelector(`#terminal_${event.target.dataset.id}`);
    let content = terminal.querySelector('.content');
    let title_bar = terminal.querySelector('.title_bar');
    if (content.classList.toggle('hidden')) {
        terminal.style.boxShadow = "none";
        title_bar.style.boxShadow = box_shadow_settings
    } else {
        terminal.style.boxShadow = box_shadow_settings;
        title_bar.style.boxShadow = "none"
    }

}
function onMouseDown(event) {
    event.preventDefault();
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
    terminal = event.target.parentNode;
    if (firstDown) {
        firstDown = false;
        elementX = parseInt(terminal.style.left);
        elementY = parseInt(terminal.style.top);
    }
}
function onMouseUp(event) {
    isMouseDown = false;
    firstDown = true;
}
function onMouseMove(event) {
    if (!isMouseDown) return;
    var deltaX = event.clientX - mouseX;
    var deltaY = event.clientY - mouseY;
    terminal = event.target.parentNode;
    terminal.style.left = elementX + deltaX + 'px';
    terminal.style.top = elementY + deltaY + 'px';
}

function onCommandSubmit(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        event.target.setAttribute('contenteditable', 'false');
        event.target.classList.add('inactive');
        const content = event.target.parentNode;
        const command = event.target.innerText.match(command_regex);
        console.log(command)
        switch (command[1]) {
            case 'help':
                result = "Implemented commands: help, clear, datetime, echo, color";
                break;
            case 'echo':
                result = command[2];
                break;
            case 'datetime':
                result = `Current time is: ${new Date().toLocaleString()}`;
                break;
            case 'clear':
                content.innerHTML = "";
                break;
            case 'color':
                content.style.backgroundColor = command[2];
                result = "Background color changed!";
                break;
            default:
                result = "Invalid command, use help to know the implemented comamnds!";
                break;

        }
        if (command[1] !== 'clear') {
            let content = event.target.parentNode;
            let responseDiv = document.createElement('div');
            responseDiv.classList.add('system_response');
            responseDiv.innerHTML = result;
            content.appendChild(responseDiv);
        }
        generateNewPrompt(content);
    }
}

function generateNewPrompt(container) {
    let userInput = document.createElement('div');
    userInput.classList.add('user_prompt');
    userInput.setAttribute('contenteditable', 'true');
    container.appendChild(userInput);
    userInput.addEventListener('keypress', onCommandSubmit);
    userInput.focus();
}