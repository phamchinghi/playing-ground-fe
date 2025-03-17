import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:8082/playing-ground/auth/test/';

class UserService {

  getPublicContent() {
    return axios.get(API_URL + 'home');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

//   getModeratorBoard() {
//     return axios.get(API_URL + 'mod', { headers: authHeader() });
//   }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();