import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const UserContextProvider = createContext();

function UserContext({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getData() {
    try {
      const response = await api.get("/auth/me");
      const res = response.data;
      if (res?.success) {
        setUser(res?.data);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function logout() {
    const response = await api.get("/auth/logout");
    const res = response.data;
    if (res?.success) {
      setUser(null);
      return true;
    }
    return false;
  }

  return (
    <UserContextProvider.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContextProvider.Provider>
  );
}

export function useUser() {
  const data = useContext(UserContextProvider);
  return data;
}

export default UserContext;
