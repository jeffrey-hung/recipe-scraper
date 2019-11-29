
import Navbar from './Navbar'
import React, { Component } from 'react'
import './../App.css'
import axios from 'axios';
import IngredientService from '../Ingredients';
import ReactTags from 'react-tag-autocomplete'

const ingredientService = new IngredientService();

class CreateRecipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            image: '',
            possible_ingredients: [],
            selected_ingredients: [],
            rows: [{}],
            suggestions: [],
            tags: [],
            new_ingredient: '',
        };
        this.handleName = this.handleName.bind(this);
        this.handleDesc = this.handleDesc.bind(this);
        this.handleImg = this.handleImg.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        var self = this;
        ingredientService.getIngredients().then(function (result) {
            self.setState({ possible_ingredients: result.data })
        });
        const item = {
            ingredient: "",
            quantity: "",
        };
        this.setState({
            rows: [item]
        });
        axios.get("http://localhost:8000/api/tag_list/").then(response => {
            console.log(response.data)
            self.setState({ suggestions: response.data['tags'] })
        });
    }
    handleName(event) {
        this.setState({ name: event.target.value });
    }
    handleDesc(event) {
        this.setState({ description: event.target.value });
    }
    handleImg(event) {
        this.setState({ image: event.target.files[0] });
    }
    handleClick(event) {
        var bodyFormData = new FormData();
        var json_arr = JSON.stringify(this.state.rows);
        bodyFormData.append("name", this.state.name);
        bodyFormData.append("description", this.state.description);
        bodyFormData.append("ingredients", json_arr);
        bodyFormData.append("image", this.state.image);
        var tag_arr = JSON.stringify(this.state.tags)
        bodyFormData.append("tags", tag_arr)
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/create_recipe/',
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                window.location = "/"
            })
            .catch((response) => {
                //handle error
                alert("Invalid Recipe")
            });
    }
    handleIngredient = id => event => {
        const { value } = event.target;
        const rows = [...this.state.rows];
        rows[id].ingredient = value
        this.setState({
            rows
        });
    };
    handleQuantity = id => event => {
        const { value } = event.target;
        const rows = [...this.state.rows];
        rows[id].quantity = value;
        this.setState({
            rows
        });
    };
    handleAddRow = () => {
        const item = {
            ingredient: "",
            quantity: ""
        };
        this.setState({
            rows: [...this.state.rows, item]
        });
    };
    handleRemoveRow = id => event => {
        this.setState({
            rows: this.state.rows.slice(0, -1)
        });
    };
    handleRemoveSpecificRow = (id) => () => {
        const rows = [...this.state.rows]
        rows.splice(id, 1)
        this.setState({ rows })
    }


    handleDelete(i) {
        const tags = this.state.tags.slice(0)
        tags.splice(i, 1)
        this.setState({ tags })
    }

    handleAddition(tag) {
        const tags = [].concat(this.state.tags, tag)
        this.setState({ tags })
    }

    handleNewIngredient(event) {
        this.setState({ new_ingredient: event.target.value });
    }
    handleIngredientAdd(event) {
        const ingredient = this.state.new_ingredient;
        axios.post('http://localhost:8000/api/add_ingredient/', { "ingredients": ingredient }).then(response => {
            this.setState({ new_ingredient: '' })
        });
        window.location.reload(true);
    }

    render() {
        return (

            <div className="create-recipe-page">
                <div className="navbar">
                    <Navbar />
                </div>
                <div className="create-recipe-container">
                    <br></br>
                    <h1>Join the Recipe Scraper Community by adding your own recipe!</h1>
                    <label htmlFor="name"><b>Name of Recipe</b></label>
                    <input type="text" placeholder="Enter name of Recipe" name="name" ID="recipe-name"
                        value={this.state.name} onChange={this.handleName} required ></input>
                    <br></br>
                    <label htmlFor="description"><b>Description</b></label>
                    <textarea placeholder="Step 1. Add......&#10;Step 2. Mix....&#10;Step 3. Heat...." name="username" ID="recipe-desc"
                        value={this.state.description} onChange={this.handleDesc} required ></textarea>
                    <br></br>
                    <label htmlFor="add_tags"><b>Tag your recipe!</b></label>
                    <ReactTags
                        tags={this.state.tags}
                        suggestions={this.state.suggestions}
                        handleDelete={this.handleDelete.bind(this)}
                        handleAddition={this.handleAddition.bind(this)}
                        minQueryLength={1}
                        maxSuggestionsLength={8}
                        placeholder={'Add tag to recipe'}
                    />
                    <br></br>
                    <label htmlFor="image"><b>Image</b></label>
                    <input type="file" onChange={this.handleImg} accept="image/png, image/jpeg" required></input>
                    <br></br>

                    <div className="iqr-Wrapper">
                        <div className="ingredient-wrapper">
                            <div className="ingredient-title">
                                <h3>Ingredient</h3>
                            </div>
                            <div className="ingredients">
                                {this.state.rows.map((item, id) => (
                                    <tr id="addr0" key={id}>
                                        <td>
                                            <select name="ingredient" ID="ingredients-name" onChange={this.handleIngredient(id)} required>
                                                <option></option>
                                                {this.state.possible_ingredients.map(c => (
                                                    <option>{c.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </div>
                        </div>
                        <div className="quantity-wrapper">
                            <div className="quantity-title">
                                <h3>Quantity</h3>
                            </div>
                            <div className="quantity">
                                {this.state.rows.map((item, id) => (
                                    <tr id="addr0" key={id}>
                                        <td>
                                            <input type="text" name="quantity" placeholder="1L.... 2 tsp...." ID="ingredients-quantity" onChange={this.handleQuantity(id)} required />
                                        </td>
                                    </tr>
                                ))}
                            </div>
                        </div>
                        <div className="remove-wrapper">
                            <div className="remove-title">
                                <h3>Remove Ingredient</h3>
                            </div>
                            <div className="quantity">
                                {this.state.rows.map((item, id) => (
                                    <tr id="addr0" key={id}>
                                        <td>
                                            <button
                                                onClick={this.handleRemoveSpecificRow(id)}
                                            >
                                                Remove
											</button>
                                        </td>
                                    </tr>
                                ))}
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>

                    <br></br>
                    <button onClick={this.handleAddRow}>
                        Add Ingredient
                    </button>
                    <br></br>
                    <button onClick={this.handleRemoveRow}>
                        Delete Last Ingredient
                    </button>
                    <br></br>

                    <br></br>
                    <div className="missing-ingredient">
                        <label htmlFor="ingredient_add"><b>Can't find your ingredient? Add it to our database!</b></label>
                        <div className="missing-ingredient-input">
                            <input type="text" placeholder="Add a new ingredient" value={this.state.new_ingredient} name="ingredient" onChange={this.handleNewIngredient.bind(this)} ></input>
                            <button  onClick={this.handleIngredientAdd.bind(this)}>Add Ingredient</button>
                        </div>
                    </div>
                    <button type="submit" onClick={this.handleClick}>Create Recipe</button>
					<br></br>

                </div>
            </div>

        );
    }

}

export default CreateRecipe;
