import { createContext, useContext, useState, useEffect } from "react";
import AuthService from "./AuthService"; // Điều chỉnh đường dẫn

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Có thể thêm hàm để cập nhật user khi cần (logout, login)
  const updateUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook để sử dụng context
export const useAuth = () => useContext(AuthContext);