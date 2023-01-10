// Import pocketbase
import { pb } from '../pocketbase.js';

// Show user status message
const userStatusContainer = document.getElementById('userStatusContainer');
const status = document.createElement('p');
status.textContent = `Signed in as: ${pb.authStore.model.username}`;
userStatusContainer.append(status);

// Allow user to logout
const logoutButton = document.createElement('button');
logoutButton.textContent = 'Logout';
logoutButton.addEventListener('click', () => {
  pb.collection('messages').unsubscribe(); // End realtime connection
  pb.authStore.clear();
  location.replace('/login/');
});
userStatusContainer.append(logoutButton);