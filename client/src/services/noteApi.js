import axios from "axios";

const noteApi = axios.create({
    baseURL: "http://localhost:3000/notes"
});

export default noteApi;