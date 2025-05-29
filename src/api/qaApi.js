import axios from "axios";
import {BASE_URL} from './config.js';

export const qaApi = {
    // ask: (question, token) => axios.post(
    //         `${BASE_URL}/ask`,
    //         { question }, {
    //         headers: {
    //             token
    //         }
    //     }),
    // createAnswer: (data, token) =>
    //     axios.post(`${BASE_URL}/create-answer`, data, {
    //         headers: { token }
    //     }),
    // getAnswerByUser: (token) =>
    //     axios.get(`${BASE_URL}/get-answer-by-user`, {
    //         headers: { token }
    //     }),
    // getUnapprovedAnswers: (token) =>
    //     axios.get(`${BASE_URL}/get-unapproved-answers`, {
    //         headers: { token }
    //     }),
    // approveAnswer: (data,token) => 
    //     axios.post(`${BASE_URL}/approve-answer`, data, {
    //         headers: { token }
    //     }),
    // getApproveHistory: (token) => 
    //     axios.get(`${BASE_URL}/get-approved-by-user`, {
    //         headers: { token }
    //     }),
    // getAllAnswers: (token) =>
    //     axios.get(`${BASE_URL}/get-all-answers`, {
    //         headers: { token }
    //     }),
}