import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-api-ulk4.onrender.com/api",
});

export default API;
