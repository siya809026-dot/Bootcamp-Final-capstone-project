import axios from "axios";

const aiApi = axios.create({
  baseURL: "https://bootcamp-final-capstone-project-2-29.onrender.com/ai",
  timeout: 30000, // 30 seconds — fails instead of hanging forever
});

export default aiApi;