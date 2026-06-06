import api from "./axiosConfig";

export function registerUser(userData) {
  return api.post("/auth/register", userData);
}

export function loginUser(loginData) {
  return api.post("/auth/login", loginData);
}