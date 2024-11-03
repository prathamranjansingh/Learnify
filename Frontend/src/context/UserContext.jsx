// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve the token from localStorage on initialization
    const token = localStorage.getItem("token");
    if (token) {
      // You may want to add a check to validate the token with your backend here
      setUser({ token }); // Set the user as logged in with the token
    }
  }, []);

  const login = (token) => {
    setUser({ token });
    localStorage.setItem("token", token); // Store token in local storage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Remove token from local storage
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
