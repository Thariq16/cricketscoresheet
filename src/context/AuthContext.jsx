import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('loggedInUserId');
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserId && storedUserInfo) {
      setAuthenticated(true);
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const login = (token, userId, userInfo) => {
    localStorage.setItem('loggedInUserToken', token);
    localStorage.setItem('loggedInUserId', userId);
    localStorage.setItem('showIntroScreen', 'true');
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setAuthenticated(true);
    setUserInfo(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('loggedInUserToken');
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('showIntroScreen');
    localStorage.removeItem('userInfo');
    setAuthenticated(false);
    setUserInfo(null);
  };

  const updateUserInfo = (updatedInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    setUserInfo(updatedInfo);
  };

  return (
    <AuthContext.Provider value={{ authenticated, userInfo, login, logout, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};