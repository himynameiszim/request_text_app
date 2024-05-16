const $ = document.querySelector.bind(document);

async function sendPrompt() {
    const promptElement = document.getElementById('prompt');
    const prompt = promptElement.value;
    promptElement.value = ''; // Clear the input area after sending the prompt
    addMessageToChatLog('<strong>You:</strong> ' + prompt); // Use prompt here

    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat`, {
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
	// First replace double newlines with a single newline, then replace newline with <br>
	const formattedMessage = message.replace(/\n\n/g, '\n').replace(/\n/g, '<br>');
	chatLog.innerHTML += '<p>' + formattedMessage + '</p>';
	chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the latest message
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

$('#sendPrompt').addEventListener('click', sendPrompt);
$('#printChat').addEventListener('click', printChat);
