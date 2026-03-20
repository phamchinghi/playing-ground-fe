import api from "./axiosInstance";

class AuthService {
  async login(username, password) {
    const response = await api.post("/auth/login", {
      username,
      password,
    });
    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", JSON.stringify(response.data.response.token));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  signup(username, email, password, roles, phone, firstname, lastname) {
    return api.post("/auth/signup", {
      username,
      email,
      password,
      roles,
      phone,
      firstname,
      lastname,
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
