import React, {Component} from 'react'
import './../App.css'
import Navbar from './Navbar'
import IngredientService from "./../Ingredients"
import axios from 'axios';

const ingredientService = new IngredientService()

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ingredients: [],
			locallist: [],
			recipes: [],	
		};
	}

	componentDidMount(){
        var self = this;
        ingredientService.getIngredients().then(function (result) {
			self.setState({ingredients: result.data})
        });
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
    	this.setState({
    		ingredients: newList
    	});
    }

    updateSearch(event) {
		this.setState({search: event.target.value.substr(0,20)});
	}

	resetList(event) {
		this.setState({locallist: [], recipes:[]}, function() {
		});
	}

	addToList(event) {
		if(this.state.locallist.indexOf(event.target.value) === -1) {
			this.setState({locallist:this.state.locallist.concat(event.target.value)}, function() {
			});
		}
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

	render () {

		const listIngredients = this.state.ingredients.map ((c) =>
			<div classname="ingredientList">
				<button value={c.name}>{c.name}</button>
			</div>
		);

		return (
			<div className="ingredient-body">
				<Navbar />
				<div className="searchbar-wrapper">
					<div className = "searchbar">
						<input type="text" value={this.state.search} onChange={this.handleChange.bind(this)} placeholder=" Search for ingredients..." />
					</div>
				</div>
				<div className="home-table" value={"example"} onClick={e => this.addToList(e, "value")}>
					<h1>Are any of these currently in your fridge?</h1>
					{listIngredients}
				</div>
				<div className="home-table">
					<h1>Your Current Ingredients List</h1>
					<ul>
						{this.state.locallist.map(item => (
							<div className="ingredient-list">
								<li key={item}>{item}</li>
							</div>
						))}
					</ul>
					<div className="home-buttons">
						<button onClick={this.resetList.bind(this)} value="Reset">Reset Ingredients</button>
						<br></br>
						<button onClick={this.handleSearch.bind(this)} value="Search">Find Recipes</button>
						<br></br>
						<button onClick={this.handleSave.bind(this)} value="Save">Save</button>
					</div>
					
					<div className="table1">
						<h1>Recipes Found</h1>
						<ul>
							{this.state.recipes.map(recipe => (
								<li key={recipe}>{recipe}</li>
							))}
						</ul>
					</div>
				</div>
			</div>
	    );
	}

}

export default Home;
