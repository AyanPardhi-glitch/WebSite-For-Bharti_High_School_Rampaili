import axios from "axios";

const DEFAULT_API_URL = "http://localhost:5000";

export const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : DEFAULT_API_URL;

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL !== undefined
  ? import.meta.env.VITE_SOCKET_URL
  : API_URL;

export const api = axios.create({
  baseURL: API_URL,
});
