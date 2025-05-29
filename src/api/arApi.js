import axios from 'axios';
import {BASE_URL} from './config.js';

export const arApi = {
    getAllAnalyzeResults: () => axios.get(`${BASE_URL}/document-ocr/`),
    postAnalyzeResults: (model,formData) => axios.post(`${BASE_URL}/document-ocr/analyze?model=${model}`, formData),
    deleteAnalyzeResults: (id) => axios.delete(`${BASE_URL}/document-ocr/${id}`),
}