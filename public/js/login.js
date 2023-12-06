import axios from 'axios';
import { showAlert } from './alert';
const authController = require('../../controllers/authController');
export const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};

// const clearJwtCookie = () => {
//   document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
// };
// export const logout = async () => {
//   try {
//     // Make a logout request to your server
//     const response = await axios('http://127.0.0.1:3000/api/v1/users/logout', {
//       method: 'POST', // or 'GET' or 'PUT' or 'DELETE', depending on your server's implementation
//       credentials: 'include', // Include credentials (cookies) in the request
//     });

//     if (response.status === 200) {
//       // Logout successful on the server
//       //clearJwtCookie(); // Clear the JWT cookie on the client
//       authController.logout;
//       // Redirect to the login page or perform any other action
//       window.location.href = '/login'; // Redirect to the login page, for example
//     } else {
//       // Handle logout failure
//       console.error('Logout failed');
//     }
//   } catch (error) {
//     console.error('Error during logout:', error);
//   }
// };
