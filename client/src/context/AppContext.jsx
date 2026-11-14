import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      setIsLoggedIn(true);
    }
  }, [token]);

  
  const loadUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`);
      if (data.success) {
        setUserData(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) loadUserData();
  }, [token]);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    token,
    setToken,
    userData,
    setUserData,
    loadUserData,
    theme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
