// import { createContext, useContext, useState, useEffect } from "react";

// interface valueTypes {
//   user: string | null;
// }

// const AuthContext = createContext<valueTypes | null>(null);

// export function useAuth() {
//   return useContext(AuthContext);
// }
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [userID, setUserID] = useState(null);

//   const login = async (email: string, password: string) => {
//     const response = await fetch(`${process.env.VITE_BASEURL}/auth/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });
//     setUserID(response.user);
//     return response;
//   };

//   const value = {
//     userID,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
