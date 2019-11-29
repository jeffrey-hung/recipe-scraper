import React, {Component} from 'react'
import './../App.css'
import Navbar from './Navbar'
import axios from 'axios';
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';

class Favourite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favouriterecipes: [], 
            ingredients: [], 
        };
    }

    componentDidMount(){
        const user = localStorage.getItem('currentUser')
        console.log({"user": user})
        if (user === '') {
            alert("Unauthorised user")
        } else  {
            axios.post('http://localhost:8000/api/favourite_list/', {"user": user}).then(response => {
                this.setState({favouriterecipes: response.data['recipes']})
            }); 
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    removeFromList(event) {
        const recipe = event.target.value;
        const user = localStorage.getItem('currentUser')
        this.setState({favouriterecipes: this.state.favouriterecipes.filter(function(item) { 
            return item !== recipe
        })});
        alert("You have unfavourited " + event.target.value+".")
        axios.post('http://localhost:8000/api/unfavourite_recipe/', {"user": user, "recipe":recipe})
        window.location="/profile"
    }

    sendIngredientList(event) {
        const user = localStorage.getItem('currentUser')
        if (user === '') {
            alert("No user logged in")
        } else {
            axios.post("http://localhost:8000/api/shopping_list/", {"user": user, "recipe":event.target.value})
            alert("You have favourited " + event.target.value +".")
        }
    }

    togglePopUp() {
        this.setState({
            showPopUp: !this.state.showPopUp
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
				  <span className="quotes-from">{c.ingredients}</span>
				  <h2>Steps</h2>
				  <span className="quotes-from">{c.description}</span>
				</div>
			)
			PopupboxManager.open({ content })
		});
      }

    render() {
        const popupboxConfig = {
			titleBar: {
			  enable: true,
			  text: 'Recipe Info',
			},
			fadeIn: true,
			fadeInSpeed: 500,
			overlayOpacity: 0,
        }
        
        const listRecipe = this.state.favouriterecipes.map ((c) =>
            <div classname="fav-recipe-list">
                <br></br>
                <br></br>
                <h3>{c.name}</h3>
				<br></br>
                <img src= {c.image} alt="Recipe Image" width="300px" height="200px"></img>
                
                <section className="button-wrapper">
                <br></br>
                <br></br>
                    <button className="recipeButton" onClick={() => {this.openPopupbox(c)}}>Show Steps</button>
                </section>
				<br></br>
                <section className="button-wrapper">
                    <button className="recipeButton" onClick={this.sendIngredientList.bind(this)} value={c.name}>Generate shopping list</button>
                </section>
				<br></br>
                <section className="button-wrapper">
                    <button className="recipeButton" onClick={this.removeFromList.bind(this)} value={c.name}>Unfavourite</button>
                </section>
            </div>
        );

        return (
			<div className="profile-wrapper">
                <PopupboxContainer {...popupboxConfig}/>
				<Navbar />
				<div className="fav-recipes">
					<br></br>
					<h1>Your Favourite Recipes</h1>
					<div className="list-recipes">
						{listRecipe}
					</div>
				</div>
			</div>
        );
    }
}

export default Favourite;
