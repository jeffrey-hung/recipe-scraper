import React, {Component} from 'react'
import './../App.css'
import Navbar from './Navbar'
import axios from 'axios';
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';

class TagSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: [],
			locallist: [],
			recipes: [],	
		};
	}

	componentDidMount(){
        var self = this;
        axios.get("http://localhost:8000/api/tag_list/").then(response => {
            self.setState({ tags: response.data['tags'] })
        });
    }

    handleChange(event) {
    	let currentList = [];
    	let newList = [];
    	if (event.target.value !== "") {
    		currentList = this.state.tags;
    		newList = currentList.filter(item => {
    			const lc = item.name.toLowerCase();
    			const filter = event.target.value.toLowerCase();
    			return lc.includes(filter);
    		});
    	} else {
    		this.componentDidMount();
    		newList = this.state.tags;
    	}
    	this.setState({
    		tags: newList
    	});
    }

	resetList(event) {
		this.setState({locallist:[], recipes:[]}, function() {
		});
	}

	addToList(event) {
		if(this.state.locallist.indexOf(event.target.value) === -1) {
			this.setState({locallist:this.state.locallist.concat(event.target.value)}, function() {
			});
		}
	}

    removeFromList(event) {
        this.setState({locallist: this.state.locallist.filter(function(tag) { 
            return tag !== event.target.value 
        })});
    }


	handleSearch(event) {
		axios.post('http://localhost:8000/api/tag_search/', {"tags":this.state.locallist}).then(response => {
            this.setState({recipes: response.data['recipes']})
        });
	}

	openPopupbox = (c) => {
		//console.log(c);
		var self = this;
		var content;
		axios.post('http://localhost:8000/api/recipe_ingredient/',{"recipe":c}).then(function (result){
		//console.log("hello")
			//console.log(result.data['ingredients'])
			let ingredient = [];
			ingredient = result.data['ingredients'];
			//console.log(result.data);
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
		const listtags = this.state.tags.map ((c) =>
			<div className="ingredientList">
				<button value={c.name}>{c.name}</button>
			</div>
		);

		const popupboxConfig = {
			titleBar: {
			  enable: true,
			  text: 'Recipe Info',
			},
			fadeIn: true,
			fadeInSpeed: 500,
			overlayOpacity: 0,
		}


		return (
			<div className="ingredient-body">
				<PopupboxContainer {...popupboxConfig}/>
				<Navbar />
				<div className="searchbar-wrapper">
					<div className = "searchbar">
						<input type="text" value={this.state.search} onChange={this.handleChange.bind(this)} placeholder=" Search for tags..." />
					</div>
				</div>
				<div className="row">
					<div className="column1">
						<div className="home-table1" value={"example"} onClick={e => this.addToList(e, "value")}>
							<h1>Are you interested in these categories?</h1>
							{listtags}
						</div>
						<br></br>
						<br></br>

					</div>
					<div className="column2">
						<div className="home-table">
							<h1>Your Current tags List</h1>
							<div className="item-list">
									{this.state.locallist.map(item => (
										<div className="ingredient-list" value={"example"} onClick={e => this.removeFromList(e, "value")}>
                                            <button value={item}>{item}</button>
										</div>
									))}
							</div>
							<div className="home-buttons">
								<button onClick={this.resetList.bind(this)} value="Reset">Reset tags</button>
								<br></br>
								<button onClick={this.handleSearch.bind(this)} value="Search">Find Recipes</button>
							</div>
						</div>
					</div>
					<div className="tag-recipes">
						<h2>Recipes Found</h2>
						<ul>
							{this.state.recipes.map(recipe => (
								<div className="tag-found-recipe">
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

export default TagSearch;
