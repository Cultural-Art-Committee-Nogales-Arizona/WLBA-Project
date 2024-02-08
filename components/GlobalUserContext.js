import React, { createContext, useState } from 'react';

const CustomUserContext = createContext();

export const CustomUserProvider = ({ children }) => {
  const [globalUserData, setCustomUserData] = useState(null);

  const updateGlobalUserData = (data) => {
    setCustomUserData(data);
  };

  return (
    <CustomUserContext.Provider value={{ globalUserData, updateGlobalUserData }}>
      {children}
    </CustomUserContext.Provider>
  );
};

export default CustomUserContext;
