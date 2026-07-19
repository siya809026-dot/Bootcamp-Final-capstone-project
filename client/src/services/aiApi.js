import axios from "axios";

const aiApi = axios.create({
  baseURL: "http://localhost:3000/ai",
  timeout: 30000, // 30 seconds — fails instead of hanging forever
});

export default aiApi;