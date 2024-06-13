const $ = document.querySelector.bind(document);

let currentTaskIndex = 0;
const endpoints = [
    `${import.meta.env.VITE_BASE_URL}/chat/task1`,
    `${import.meta.env.VITE_BASE_URL}/chat/task2`,
    `${import.meta.env.VITE_BASE_URL}/chat/task3`,
    `${import.meta.env.VITE_BASE_URL}/chat/task4`
];

let countdownTimer;
let countdownSeconds = 120;

async function sendPrompt() {
    const promptElement = document.getElementById('prompt');
    const prompt = promptElement.value.trim();

    if (prompt === '') {
        addMessageToChatLog('<strong>GPT:</strong> You are sending an empty message. Type something in chat box and try again.');
        return;
    }

    promptElement.value = '';
    addMessageToChatLog('<strong>You:</strong> ' + prompt);

    try {
        const response = await axios.post(endpoints[currentTaskIndex], {
            prompt: prompt,
        });

        console.log('Prompt submitted:', prompt);

        const text = response.data.response;
        addMessageToChatLog('<strong>GPT:</strong> ' + text);
    } catch (error) {
        console.error('Error submitting prompt:', error);
    }
}

function addMessageToChatLog(message) {
    const chatLog = document.getElementById('chat-log');
    const formattedMessage = message.replace(/\n\n/g, '\n').replace(/\n/g, '<br>');
    chatLog.innerHTML += '<p>' + formattedMessage + '</p>';
    chatLog.scrollTop = chatLog.scrollHeight;
}

function printChat() {
    const chatContent = document.getElementById('chat-log').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Chat Log</title></head><body>');
    printWindow.document.write(chatContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function nextTask() {
    currentTaskIndex++;
    if (currentTaskIndex < endpoints.length) {
        showTaskTextbox(currentTaskIndex);
        startCountdown();
    } else {
        const nextTaskButton = $('#nextTask');
        nextTaskButton.disabled = true;
        clearInterval(countdownTimer);
        document.getElementById('timer').innerHTML = 'All tasks completed!';
    }
}

function startTask() {
    document.getElementById('prompt').disabled = false;
    document.getElementById('sendPrompt').disabled = false;
    hideTaskTextboxes();
    const nextTaskButton = $('#nextTask');
    nextTaskButton.disabled = true; // Disable the Next Task button until countdown reaches 0
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.innerHTML = countdownSeconds + ' seconds'; // Display the remaining time
    }
}


function showTaskTextbox(index) {
    hideTaskTextboxes();
    const taskTextboxes = document.getElementsByClassName('task-textbox');
    if (index < taskTextboxes.length) {
        taskTextboxes[index].classList.remove('hidden');
    }
}

function hideTaskTextboxes() {
    const taskTextboxes = document.getElementsByClassName('task-textbox');
    for (let i = 0; i < taskTextboxes.length; i++) {
        taskTextboxes[i].classList.add('hidden');
    }
}

$('#sendPrompt').addEventListener('click', sendPrompt);
$('#printChat').addEventListener('click', printChat);
$('#nextTask').addEventListener('click', nextTask);
$('#startTask').addEventListener('click', startTask);

document.addEventListener('DOMContentLoaded', function() {
    const taskContainer = document.getElementById('task-container');
    const tasks = [
        "Task 1:\nStudent role: You are organizing an event in which local businesses' products are showcased to the public. You would like to use a photograph (you already have the photograph) of one local businesses' products in the event flyer. Meet and speak with Mr. Blair- the business owner- to ask for permission. Initiate the conversation, make your request, and complete the conversation.",
        "Task 2:\nStudent role: You have a close friend who is an international student at university. You want to practice your English conversation skill next week, so you meet and speak with the friend asking if they spend five minutes of their time talking with you in English. Initiate the conversation, make your request, and complete the conversation.",
        "Task 3:\nStudent role: You and a classmate (a friend) are working together on a research project. Both of you are scheduled to give an important presentation two days from now on the project. However, you realize you have a conflict in your schedule. Meet and speak with your classmate asking him/her to present both your part of the presentation and theirs. This will be considerable extra work for your classmate. Initiate the conversation, make your request, and complete the conversation.",
        "Task 4:\nStudent role: You are organizing a university event in which local businesses’ products are showcased to the public. To help fund the event, you want local business people to make financial donations. Meet and speak with Mr. Smith- a local business owner in Aizu-wakamatsu- to ask for a financial donation. You do not know Mr. Smith. Initiate the conversation, make your request, and complete the conversation."
    ];
    tasks.forEach(function(task) {
        const textarea = document.createElement('textarea');
        textarea.classList.add('task-textbox');
        textarea.readOnly = true;
        textarea.value = task;
        taskContainer.appendChild(textarea);
    });
    showTaskTextbox(currentTaskIndex);
    startCountdown();
});

// Ensure the countdown continues
function startCountdown() {
    clearInterval(countdownTimer);
    countdownSeconds = 30; // Set your desired countdown seconds
    const nextTaskButton = $('#nextTask');
    nextTaskButton.disabled = true;
    const startTaskButton = $('#startTask');
    startTaskButton.disabled = false;

    document.getElementById('prompt').disabled = true;
    document.getElementById('sendPrompt').disabled = true;

    const timerElement = document.getElementById('timer');
    if (!timerElement) return;

    timerElement.innerHTML = countdownSeconds + ' seconds';

    countdownTimer = setInterval(() => {
        countdownSeconds--;
        timerElement.innerHTML = countdownSeconds + ' seconds';
        if (countdownSeconds <= 0) {
            clearInterval(countdownTimer);
            timerElement.innerHTML = 'Time is up!';
            hideTaskTextboxes();
            document.getElementById('prompt').disabled = false;
            document.getElementById('sendPrompt').disabled = false;
            nextTaskButton.disabled = false; // Enable the Next Task button when time is up
        }
    }, 1000);
}