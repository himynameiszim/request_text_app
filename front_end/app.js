const $ = document.querySelector.bind(document);

let currentTaskIndex = 0;
const endpoints = [
    `${import.meta.env.VITE_BASE_URL}/chat/task1`,
    `${import.meta.env.VITE_BASE_URL}/chat/task2`,
    `${import.meta.env.VITE_BASE_URL}/chat/task3`,
    `${import.meta.env.VITE_BASE_URL}/chat/task4`
];

async function sendPrompt() {
    const promptElement = document.getElementById('prompt');
    const prompt = promptElement.value.trim();

    if (prompt === '') {
        addMessageToChatLog('<strong>Predatory Scientist:</strong> You are sending an empty message. Type something in chat box and try again.');
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
        addMessageToChatLog('<strong>Predatory Scientist:</strong> ' + text);
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
    currentTaskIndex = (currentTaskIndex + 1) % endpoints.length;
    seconds = 5;
    showTaskTextbox(currentTaskIndex);
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

    // Disable the "Next Task" button initially
    const nextTaskButton = $('#nextTask');
    nextTaskButton.disabled = true;

    // Enable the "Next Task" button after 5 minutes (300000 milliseconds)
    setTimeout(() => {
        nextTaskButton.disabled = false;
    }, 5000);
});

let seconds = 5;

function countDown() {
    seconds--;
    document.getElementById('time').innerHTML = seconds + ' seconds ';
    if (seconds <= 0) {
        clearInterval(myVar);
        document.getElementById('timer').innerHTML = 'Time is up!';
        hideTaskTextboxes();
    }
}
const myVar = setInterval(countDown, 1000);

document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const nextTaskButton = document.getElementById('nextTask');

    nextTaskButton.addEventListener('click', () => {
        chatLog.innerHTML = ''; // Clear all content in the chat log
    });

    // Example of adding a message to the chat log (for context)
    document.getElementById('sendPrompt').addEventListener('click', () => {
        const prompt = document.getElementById('prompt').value;
        if (prompt.trim() !== '') {
            const message = document.createElement('div');
            message.textContent = prompt;
            chatLog.appendChild(message);
            document.getElementById('prompt').value = '';
        }
    });
});
