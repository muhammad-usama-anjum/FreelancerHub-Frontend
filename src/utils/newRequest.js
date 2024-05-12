import axios from "axios";

const newRequest =axios.create({
    baseURL:"https://freelancerhub-backend-2.onrender.com/api/",
    withCredentials:true,
})

export default newRequest;