import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import Login from "./pages/Login";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";

// Create context for user data
export const UserContext = createContext();

export default function App() {
  const [updatedUsers, setUpdatedUsers] = useState({});
  
  // Load any saved user updates from localStorage
  useEffect(() => {
    const savedUpdates = localStorage.getItem('userUpdates');
    if (savedUpdates) {
      setUpdatedUsers(JSON.parse(savedUpdates));
    }
  }, []);

  // Function to update a user
  const updateUserData = (id, userData) => {
    const newUpdates = {
      ...updatedUsers,
      [id]: userData
    };
    setUpdatedUsers(newUpdates);
    // Save to localStorage for persistence
    localStorage.setItem('userUpdates', JSON.stringify(newUpdates));
  };

  return (
    <UserContext.Provider value={{ updatedUsers, updateUserData }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/users" element={<Users />} />
          <Route path="/edit/:id" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
