import axios from "axios";

const axiosClientNoToken = axios.create({
    baseURL: 'https://localhost:8443',
    withCredentials: true,
});

export default axiosClientNoToken