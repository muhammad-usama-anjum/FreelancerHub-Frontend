import React from "react";
import { createContext, useContext, useState } from "react";

const GigContext = createContext();

export const useGigContext = () => {
  return useContext(GigContext);
};

export const GigProvider = ({ children }) => {
  // You can set an initial value if needed
  const [selectedGigId, setSelectedGigId] = useState(null);

  return (
    <GigContext.Provider value={{ selectedGigId, setSelectedGigId }}>
      {children}
    </GigContext.Provider>
  );
};
