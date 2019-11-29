import React, { Component } from 'react'
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
//import "react-popupbox/dist/react-popupbox.css"
import './../App.css'
import {Link} from 'react-router-dom';
import Navbar from './Navbar'
import RecipeService from './../Recipes';
import axios from 'axios';

const recipeService = new RecipeService();
class Recipes extends Component {
	constructor(props){
        super(props);
        this.state = {
			recipes: [],
			ingredients:[],
            recipe_suggestions: [],
		};
		//this.openPopupbox = this.openPopupbox.bind(this)
		
	}

	componentDidMount(){
		var self = this;
		const user = localStorage.getItem('currentUser');
        if (user === '') {
            recipeService.getRecipes().then(function (result){
    			self.setState({ recipes: result.data})
            });
        } else {
            axios.post('http://localhost:8000/api/ingredient_suggestion/', {"user":user}).then(function (result) {
                //console.log(result.data)
                recipeService.getRecipes().then(function (result){
                    self.setState({ recipes: result.data})
                });
                self.setState({ recipe_suggestions: result.data['data']})
            });
        }
	}
	
	handleChange(event) {
    	let currentList = [];
    	let newList = [];
    	//console.log(event.target.value);
    	if (event.target.value !== "") {
    		currentList = this.state.recipes;
    		newList = currentList.filter(item => {
    			const lc = item.name.toLowerCase();
    			const filter = event.target.value.toLowerCase();
    			return lc.includes(filter);
    		});
    	} else {
    		this.componentDidMount();
    		newList = this.state.recipes;
    	}
    	this.setState({
    		recipes: newList
    	});
    }
	openPopupbox = (c) => {
		var self = this;
		var content;
		axios.post('http://localhost:8000/api/recipe_ingredient/',{"recipe":c.name}).then(function (result){
			let ingredient = [];
			ingredient = result.data['ingredients']
			self.setState({
				ingredients: ingredient
			})
			content = (
				<div className="box-wrapper"> 
				  <h1 className="quotes">{c.name}</h1>
				  <h2>Ingredients</h2>
				  {self.state.ingredients.map(i => (
					  <div>
					  <p className="quotes">{i.ingredient} {i.quantity}</p>
					  </div>
				  ))}
				  <h2>Steps</h2>
				  <span className="quotes-from">{c.description}</span>
				</div>
			)
			PopupboxManager.open({ content })
		});
      }

    sendIngredientList(event) {
        const user = localStorage.getItem('currentUser')
        if (user === '') {
            alert("No user logged in")
        } else {
			axios.post("http://localhost:8000/api/shopping_list/", {"user": user, "recipe":event.target.value})
			alert("Your shopping list has been sent to your email")
        }
    }

    favouriteRecipe(event) {
        const user = localStorage.getItem('currentUser')
        console.log(user)
        if ( user === '') {
            alert("No user logged in")
        } else {
			axios.post("http://localhost:8000/api/favourite_recipe/", {"user": user, "recipe":event.target.value})
			alert("You have favourited " + event.target.value +".")
        }
    }

	render () {		
		const popupboxConfig = {
			titleBar: {
			  enable: true,
			  text: 'Recipe Info',
			},
			fadeIn: true,
			fadeInSpeed: 500,
			overlayOpacity: 0,
		}

        /*Display suggested recipes*/
        let recipe_suggestions = this.state.recipe_suggestions.map ((c) =>
            <div classname="recipeList" ID="recipeList">
                <h3>{c.name}</h3>
                <section className="recipeImg">
                <img src= {c.image} alt="Recipe Image" width="300px" height="200px"></img>
                </section>
                <section className="button-wrapper" >
                    <button className="recipeButton" onClick={() => {this.openPopupbox(c)}}>Show Recipe</button>
                    <button className="recipeButton" onClick={this.sendIngredientList.bind(this)} value={c.name}>Shopping List</button>
                    <button className="recipeButton" onClick={this.favouriteRecipe.bind(this)} value={c.name}>Favourite</button>
                </section>
            </div>
        );

		/*Display all recipes in db*/
		let listRecipe = this.state.recipes.map ((c) =>
			<div classname="recipeList" ID="recipeList">
				<h3>{c.name}</h3>
				<section className="recipeImg">
				<img src= {c.image} alt="Recipe Image" width="300px" height="200px"></img>
				</section>
				<section className="button-wrapper">
					<button className="recipeButton" onClick={() => {this.openPopupbox(c)}}>Show Recipe</button>
                    <button className="recipeButton" onClick={this.sendIngredientList.bind(this)} value={c.name}>Shopping List</button>
                    <button className="recipeButton" onClick={this.favouriteRecipe.bind(this)} value={c.name}>Favourite</button>
                </section>
			</div>
		);
		
		let UserStateLink1;
        if (localStorage.getItem('currentUser')!='') {
            UserStateLink1 = <Link to="/tagsearch">Want to search by tags instead?</Link>
        }
		
		
		return (
			<div className="recipe-body">
				<PopupboxContainer {...popupboxConfig}/>
				<Navbar />
				<div className="searchbar-wrapper">
					<div className = "searchbar">
						<input type="text" value={this.props.search} onChange={this.handleChange.bind(this)} placeholder=" Search for recipes..." />
					</div>
				</div>
				<br></br>
				<div className="recipeCreator">
					{UserStateLink1}
				</div>
				<br></br>
				<div className="recipe-table-wrapper">
					<h1>Recommended Recipes</h1>
					<div className="recipe-table">  
						{recipe_suggestions}            
					</div>
					<br></br>
					<div className="recipe-table1">	
						<h1>All Recipes</h1>
						{listRecipe}			
					</div>
					<br></br>
				</div>
				
			</div>
	  );
	}
	
}

export default Recipes;