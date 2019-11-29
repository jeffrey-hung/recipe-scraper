import React, { Component } from 'react'
import './../App.css'
import {Link} from 'react-router-dom';

class Navbar extends Component{
	ResetCookie(){
		alert("Logging out of "+localStorage.getItem('currentUser'))
		localStorage.setItem('currentUser', '')
	}

  	render(){
		  let UserStateLink;
		  let CreateRecipeButton;
		  let ProfileLink;
		  let UserFavourite;
  		if (localStorage.getItem('currentUser')==='') {
	     	UserStateLink = <Link to="/login"><li>Log in / Sign up</li></Link>
	    } else {
	    	ProfileLink = <Link to="/profile"><li>My Profile</li></Link>
			CreateRecipeButton = <Link to="/create_recipe"><li>Create Recipe</li></Link>
	    	UserStateLink = <Link to="/" onClick={this.ResetCookie}><li>Logout</li></Link>
	    	UserFavourite=<Link to="/favourite"><li>Favourite Recipes</li></Link>
	    } 
  		return (
			<div className="recipe-page">
				<div className="side-navbar-wrapper">
					<div className="side-navbar">
						<h1>Recipe Scraper</h1>
						<div className="side-links">
							{ProfileLink}
							<Link to="/fridge">
								<li>My Fridge</li>
							</Link>
							{UserFavourite}
							{CreateRecipeButton}
							<Link to="/recipes">
								<div className="sideRecipe">
									<li>Recipes</li>
								</div>	
							</Link>
							{UserStateLink}
						</div>
					</div>
				</div>
			</div>
	  	);
  }
}

export default Navbar;