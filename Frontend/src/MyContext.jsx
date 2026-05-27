import { createContext } from "react";

// Default value is an empty object — consumers outside the provider
// get a safe fallback instead of a type error from ""
export const MyContext = createContext({});