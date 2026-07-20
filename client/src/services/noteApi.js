import axios from "axios";

const noteApi = axios.create({
    baseURL: "https://bootcamp-final-capstone-project-2-28.onrender.com/notes"
});

export default noteApi;