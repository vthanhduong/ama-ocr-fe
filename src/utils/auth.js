import { localStorageService } from "../services/localStorageService";

export const getToken = () => localStorageService.getItem("token");
export const setToken = (token) => localStorageService.setItem("token", token);
export const clearToken = () => localStorageService.removeItem("token");