import axios from 'axios';

const loginUser = async (email, password) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login/', {
      email: email,
      password: password
    });
    console.log(response.data); // token au user info
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response.data);
  }
};
