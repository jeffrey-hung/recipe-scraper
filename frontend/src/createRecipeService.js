import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class CreateRecipeService{
    constructor(){

    }
    getForm(){
        const url = `${API_URL}/api/get_recipe_form/`;
        return axios.get(url).then(response => response.data);   
    }
}