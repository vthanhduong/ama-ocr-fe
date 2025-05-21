import axios from "axios";
import {BASE_URL} from './config.js';

export const authApi = {
    requestOTP: (email) => axios.post(`${BASE_URL}/request-otp`, { email }),
    verifyOTP: (email, otp) => axios.post(`${BASE_URL}/verify-otp`, { email, otp })
}