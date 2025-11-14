import React, { createContext, useReducer } from 'react';
import { reducer, initialState } from './reducers';
export const AppContext = createContext();
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}
