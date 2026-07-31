import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7163/api"
});

export default api;