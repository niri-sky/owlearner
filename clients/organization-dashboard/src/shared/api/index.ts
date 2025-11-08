import axios from "axios";

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

const api = axios.create({
  baseURL: SERVER_URI,
});

export default api;
