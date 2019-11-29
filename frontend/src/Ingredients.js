import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class IngredientService {
    getIngredients(){
        const url = `${API_URL}/api/ingredient/`;
        return axios.get(url).then(response => response.data);   
    }
}