// Import pocketbase
import { pb } from '../pocketbase.js';

// Utility: Clear all children of element
function removeChilds(parent) {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

// Declare var (global): messages
let messages;

// Get initial messages
const resultList = await pb.collection('messages').getList(1, 50, {
  sort: 'created',
});

// Set messages var to initial messages
messages = resultList.items;

// Grab messagesContainer for reference
const messagesContainer = document.getElementById('messagesContainer');

// Declare function: Push messages array to DOM
function showMessages() {
  for (let index = 0; index < messages.length; index++) {
    const message = messages[index];
    const p = document.createElement('p');
    p.textContent = message.text;
    messagesContainer.append(p);
  }
}

// Initial load: Push messages array to DOM
showMessages();


// Declare function: Subscribe to realtime messages
async function subscribeToMessages() {
  await pb.collection('messages').subscribe('*', async ({ action, record }) => {
    if (action === 'create') {
      const msg = document.createElement('p');
      msg.textContent = record.text;
      messagesContainer.append(msg);
      messages = [...messages, record]; // Update messages array
      /* const user = await pb.collection('users').getOne(record.user); // Fetch associated user
      record.expand = { user }; */
    }
    if (action === 'delete') {
      removeChilds(messagesContainer); // Clear DOM messages
      messages = messages.filter((m) => m.id !== record.id); // Update messages array
      showMessages(); // Push messages array to DOM
    }
  });
}

// Initial load: Subscribe to realtime messages
subscribeToMessages();

// Handle nav away and to page
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'hidden') {
    pb.collection('messages').unsubscribe(); // End realtime connection
    removeChilds(messagesContainer); // Clear DOM messages
  }

  if (document.visibilityState === 'visible') {
    const resultList = await pb.collection('messages').getList(1, 50, {
      sort: 'created',
    });
    messages = resultList.items;
    showMessages();
    subscribeToMessages();
  }
});


// ----------------------
// NEW MESSAGE FORM LOGIC
// ----------------------

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
