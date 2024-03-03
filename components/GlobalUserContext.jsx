import React, { createContext, useState } from 'react';

const CustomUserContext = createContext();

export const CustomUserProvider = ({ children }) => {
  const [globalUserData, setGlobalUserData] = useState({
    _id: "",
    username: "",
    email: "",
    admin: false,
    adminAuthId: false
  });

  return (
    <CustomUserContext.Provider value={{ globalUserData, setGlobalUserData }}>
      {children}
    </CustomUserContext.Provider>
  );
};

export default CustomUserContext;
