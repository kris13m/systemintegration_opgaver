const ws = new WebSocket('ws://localhost:8080');

const sendBtn = document.getElementById('sendBtn');
const input = document.getElementById('msg');
const messages = document.getElementById('messages');

ws.onopen = () => {
  console.log('Browser WebSocket connected');
};

ws.onmessage = (event) => {
  const li = document.createElement('li');
  li.textContent = `Server: ${event.data}`;
  messages.appendChild(li);
};

sendBtn.addEventListener('click', () => {
  const message = input.value.trim();
  if (message) {
    ws.send(message);
    input.value = '';
  }
});