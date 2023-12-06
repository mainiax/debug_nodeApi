import '@babel/polyfill';
import { logout, login } from './login';
import { displayMap } from './mapbox';
//Dom elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');
//values
const email = document.getElementById('email');
const password = document.getElementById('password');
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

///delegation
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    login(email.value, password.value);
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
