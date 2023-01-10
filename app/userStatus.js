//import pocketbase
import { pb } from '../pocketbase.js';

//Show user status message
const container = document.getElementById('container');
const status = document.createElement('p');
status.textContent = `Signed in as: ${pb.authStore.model.username}`;
container.append(status);

//Allow user to logout
const logoutButton = document.createElement('button');
logoutButton.textContent = 'Logout';
logoutButton.addEventListener('click', () => {
  pb.authStore.clear();
  location.replace('/login/');
});
container.append(logoutButton);