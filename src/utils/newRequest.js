import axios from "axios";

const newRequest =axios.create({
    baseURL:"https://freelancer-hub-backend.vercel.app/api/",
    withCredentials:true,
})

export default newRequest;