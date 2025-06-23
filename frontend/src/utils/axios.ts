import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
});

// Remove any default Authorization header
instance.defaults.headers.common["Authorization"] = undefined;

export default instance;
