import axios from "axios";

const authApi = axios.create({
    baseURL: "https://bootcamp-final-capstone-project-2-28.onrender.com/auth"
});

export default authApi;