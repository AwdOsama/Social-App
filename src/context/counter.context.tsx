import React, { createContext, useState } from "react";

type counterContextType = {
  counter: number;
  increase: () => void;
};
//create context
export const counterContext = createContext<counterContextType | null>(null);
export function CounterContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [counter, setCounter] = useState<number>(0);

  function increase() {
    setCounter(counter + 1);
  }
  return (
    <counterContext.Provider value={{ counter, increase }}>
      {children}
    </counterContext.Provider>
  );
}
