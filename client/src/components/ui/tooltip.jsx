import { createContext, useContext } from "react";

const TooltipContext = createContext({});

export function TooltipProvider({ children, ...props }) {
  return (
    <TooltipContext.Provider value={props}>
      {children}
    </TooltipContext.Provider>
  );
}

export function Tooltip({ children }) {
  return <div>{children}</div>;
}

export function TooltipTrigger({ children }) {
  return <div>{children}</div>;
}

export function TooltipContent({ children }) {
  return <div>{children}</div>;
}