import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class RecipeService{
    getRecipes() {
        const url = `${API_URL}/api/recipe/`;
        return axios.get(url).then(response => response.data);
    }
}