import axios from "axios";
import { getAuthToken } from "../utils/auth.js";

const API_BASE_URL = "https://reqres.in/api";

// Configure axios with auth token
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const getUsers = async (page = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users?page=${page}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const getUser = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
};

export const updateUser = async (id, userData) => {
  try { 
   // Using PUT request to update user data
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response || error);
    throw new Error("Failed to update user");
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
    return true;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};
