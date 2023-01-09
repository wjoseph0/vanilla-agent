//import pocketbase
import { pb } from '../pocketbase'

//if already logged in go to app
if (pb.authStore.model) {
  location.replace('/app/')
}

//declare login function
const login = async () => {
  const usernameInput = document.getElementById('usernameInput')
  const passwordInput = document.getElementById('passwordInput')
  await pb.collection('users').authWithPassword(usernameInput.value, passwordInput.value)
}

//handle login form submit
const loginForm = document.getElementById('loginForm')
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  await login();
  location.replace('/app/')
});