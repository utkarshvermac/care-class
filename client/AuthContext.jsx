import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("careclass_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("careclass_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("careclass_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("careclass_token");
        localStorage.removeItem("careclass_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("careclass_token", data.token);
    localStorage.setItem("careclass_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data);
    toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data);
    toast.success(`Account created — welcome to CARE CLASS, ${data.user.name.split(" ")[0]}!`);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/me", payload);
    setUser(data.user);
    localStorage.setItem("careclass_user", JSON.stringify(data.user));
    toast.success("Profile updated");
  };

  const logout = () => {
    localStorage.removeItem("careclass_token");
    localStorage.removeItem("careclass_user");
    setUser(null);
    toast("Signed out — see you next class!", { icon: "👋" });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
