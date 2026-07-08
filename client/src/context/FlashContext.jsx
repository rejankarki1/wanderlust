import { createContext, useContext, useMemo, useState } from "react";

const FlashContext = createContext(null);

export const FlashProvider = ({ children }) => {
  const [flash, setFlash] = useState(null);

  const showFlash = (type, message) => {
    setFlash({ type, message });
  };

  const clearFlash = () => {
    setFlash(null);
  };

  const value = useMemo(() => ({ flash, showFlash, clearFlash }), [flash]);

  return <FlashContext.Provider value={value}>{children}</FlashContext.Provider>;
};

export const useFlash = () => useContext(FlashContext);
