import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'https://localhost:8443',
    withCredentials: true,
});

export default axiosClient