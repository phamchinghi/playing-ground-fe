import axios from "axios";

const BASE_URL = 'http://localhost:8082/playing-ground/auth/';

class AuthService {
  async login(username, password) {
    const response = await axios
      .post(BASE_URL + "login", {
        username,
        password
      });
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  logout(){
    localStorage.removeItem("user");
  }

  signup(username, email, password, roles, phone, firstname, lastname){
    return axios.post(BASE_URL + "signup", {
      username,
      email,
      password,
      roles,
      phone,
      firstname,
      lastname
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    // Check if the value is null or undefined before parsing
    if (userStr === undefined) {
        return null; // Return null instead of undefined
    }
    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        return null;
    }
  }

}


// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();
