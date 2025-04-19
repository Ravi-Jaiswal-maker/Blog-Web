import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("token")
  );
  const [adminName, setAdminName] = useState(() =>
    localStorage.getItem("adminName")
  );
  const [loading, setLoading] = useState(true);

  const login = (token, name) => {
    localStorage.setItem("token", token);
    localStorage.setItem("adminName", name);
    setAuthToken(token);
    setAdminName(name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    setAuthToken(null);
    setAdminName(null);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        adminName,
        login,
        logout,
        isAuthenticated: !!authToken,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
