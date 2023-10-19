import axios from 'axios';

const NODE_ENV = "development"

let baseURL = 'http://localhost:5000'; // Default base URL

if (NODE_ENV === "production") {
  // If in production environment, update the base URL
  baseURL = 'https://eco-world-server.vercel.app'; // Set your production API URL here
}

const instance = axios.create({
  baseURL: baseURL,
});

export default instance;
