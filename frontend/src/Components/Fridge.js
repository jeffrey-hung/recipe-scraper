import React, {Component} from 'react'
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import './../App.css'
import Navbar from './Navbar'
import IngredientService from "./../Ingredients"
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react'

const ingredientService = new IngredientService()

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ingredients: [],
			locallist: [],
			recipes: [],	
			value: '',
			ingredientsRecipe:[],
		};
	}

	componentDidMount(){
        var self = this;
        ingredientService.getIngredients().then(function (result) {
			self.setState({ingredients: result.data})
        });
        this.resetLocalList();
    }

    resetLocalList() {
        const user = localStorage.getItem('currentUser');
        if (user === '') {
            this.setState({locallist:[]});
        } else {
            axios.post('http://localhost:8000/api/user_ingredient/', {'user': user}).then((response) => {
                this.setState({locallist:response.data['ingredients']});
            });
        }
	}

    handleChange(event) {
    	let currentList = [];
    	let newList = [];
    	if (event.target.value !== "") {
    		currentList = this.state.ingredients;
    		newList = currentList.filter(item => {
    			const lc = item.name.toLowerCase();
    			const filter = event.target.value.toLowerCase();
    			return lc.includes(filter);
    		});
    	} else {
    		this.componentDidMount();
    		newList = this.state.ingredients;
    	}
        this.resetLocalList();
    	this.setState({
    		ingredients: newList
    	});
    }

	resetList(event) {
		this.setState({locallist:[], recipes:[]}, function() {
		});
	}

	addToList(event) {
        if (event.target.value == null) {
            return;
        }
		else if(this.state.locallist.indexOf(event.target.value) === -1) {
			this.setState({locallist:this.state.locallist.concat(event.target.value)}, function() {
			});
		}
	}

    removeFromList(event) {
        this.setState({locallist: this.state.locallist.filter(function(ingredient) { 
            return ingredient !== event.target.value 
        })});
    }

	handleSearch(event) {
		axios.post('http://localhost:8000/api/search_ingredients/', {"ingredients":this.state.locallist}).then(response => this.setState({recipes: response.data['recipes']}));
	}

	handleSave(event) {
        const user = localStorage.getItem('currentUser');
        if (user === '') {
            return;
        } else {
          axios.post('http://localhost:8000/api/ingredient_save/', {"ingredients":this.state.locallist, "user":user});
        }
	}
    
    handleChange = (e, { value }) => {
        this.setState({ locallist: value })
    };
	openPopupbox = (c) => {
		var self = this;
		var content;
		axios.post('http://localhost:8000/api/recipe_ingredient/',{"recipe":c}).then(function (result){
			let ingredient = [];
			ingredient = result.data['ingredients'];
			self.setState({
				ingredientsRecipe: ingredient
			})
			content = (
				<div className="box-wrapper"> 
				  <h1 className="quotes">{c.name}</h1>
				  <h2>Ingredients</h2>
				  {self.state.ingredientsRecipe.map(i => (
					  <div>
					  <p className="quotes">{i.ingredient} {i.quantity}</p>
					  </div>
				  ))}
				  <h2>Steps</h2>
				  <span className="quotes-from">{result.data['recipe'].description}</span>
				</div>
			)
			PopupboxManager.open({ content })
		});
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

        const user = localStorage.getItem('currentUser');
        let homebutton;
        if (user==='') {
            homebutton = ''
        } else {
            homebutton = <button onClick={this.handleSave.bind(this)} value="Save">Save</button>
		} 
		
		const stateOptions = this.state.ingredients.map((c) => ({
			key: c.name,
			text: c.name,
			value: c.name,
		}))

		return (
			<div className="ingredient-body">
				<PopupboxContainer {...popupboxConfig}/>
				<Navbar />
				<div className="row">
					<div className="column1">
						<div className="home-table">
							<h2>Add your ingredients to your fridge</h2>
							<Dropdown 
								onClick={e => this.addToList(e, "value")}
								placeholder='Ingredients'
								fluid
								multiple
								search
                                clearable
								selection
                                allowAdditions={true}
								options={stateOptions}
                                onChange={this.handleChange.bind(this)}
		  					/>
							<br></br>
							<br></br>
							
						</div>
					</div>
					<div className="column2">
						<div className="home-table">
						<h2>Your Current Ingredients List</h2>
							<div className="item-list">
									{this.state.locallist.map(item => (
										<div className="ingredient-list" value={"example"} onClick={e => this.removeFromList(e, "value")}>
                                            <button value={item}>{item}</button>
										</div>
									))}
							</div>
							<br></br>
							<br></br>
							<div className="home-buttons">
								<button onClick={this.resetList.bind(this)} value="Reset">Reset Ingredients</button>
								<br></br>
								<button onClick={this.handleSearch.bind(this)} value="Search">Find Recipes</button>
								<br></br>
								{homebutton}
							</div>
						</div>
					</div>
					<div className="found-recipes">
						<h2>Recipes Found</h2>
						<ul>
							{this.state.recipes.map(recipe => (
								<div className="fridge-found-recipe">
									<li key={recipe}>
										<a>{recipe}</a>
										<br></br>
										<br></br>
										<button className="recipeButton" onClick={() => {this.openPopupbox(recipe)}}>Show Recipe</button>
									</li>
								</div>
							))}
						</ul>
					</div>
				</div>
			</div>
	    );
	}

}

export default Home;
