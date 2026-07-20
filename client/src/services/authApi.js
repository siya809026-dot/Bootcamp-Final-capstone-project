import axios from "axios";

const authApi = axios.create({
    baseURL: "https://bootcamp-final-capstone-project-2-29.onrender.com/auth"
});

export default authApi;