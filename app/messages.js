// Import pocketbase
import { pb } from '../pocketbase.js';

// Grab messagesContainer for reference
const messagesContainer = document.getElementById('messagesContainer');

// Declare global messages var
let messages;

// Get initial messages
const resultList = await pb.collection('messages').getList(1, 50, {
  sort: 'created',
});
messages = resultList.items;

// Push messages to DOM
function showMessages() {
  for (let index = 0; index < messages.length; index++) {
    const message = messages[index];
    const p = document.createElement('p');
    p.textContent = message.text;
    messagesContainer.append(p);
  }
}
// Initial load: Push messages to DOM
showMessages();

// Clear all children of element
function removeChilds(parent) {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

// Subscribe to realtime messages
await pb.collection('messages').subscribe('*', async ({ action, record }) => {
  removeChilds(messagesContainer); // Clear messages

  if (action === 'create') {
    const user = await pb.collection('users').getOne(record.user); // Fetch associated user
    record.expand = { user };
    messages = [...messages, record]; // Update messages
    showMessages(); // Push messages to DOM
  }
  if (action === 'delete') {
    messages = messages.filter((m) => m.id !== record.id); // Update messages
    showMessages(); // Push messages to DOM
  }
});

// Grab new message form elements
const newMessageForm = document.getElementById('newMessageForm');
const messageInput = document.getElementById('messageInput');

// Send new message
async function sendMessage() {
  const data = {
    text: messageInput.value,
    user: pb.authStore.model.id
  };
  await pb.collection('messages').create(data);
  messageInput.value = '';
}

// Handle new message form submit
newMessageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});
