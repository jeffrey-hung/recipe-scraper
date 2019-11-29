import React, {Component} from "react";
import './App.css';
import Login from './Components/Login';
import Recipes from './Components/Recipes';
import Fridge from './Components/Fridge';
import Register from './Components/Register';
import ResetPassword from './Components/ResetPassword';
import Profile from './Components/Profile'
import Favourite from './Components/Favourite'
/*npm install --save react-router-dom //for below import to function*/
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CreateRecipe from "./Components/CreateRecipe";
import 'semantic-ui-css/semantic.min.css';
import TagSearch from "./Components/TagSearch";





class App extends Component {

	render() {
		return (
			<Router>
				<div className="App">
					<Switch>
						<Route path="/" exact component={Fridge} />
						<Route path="/fridge" component={Fridge} />
						<Route path="/recipes" component={Recipes} />	
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route path="/create_recipe" component={CreateRecipe}/>
						<Route path="/resetpassword" component={ResetPassword} />
						<Route path="/profile" component={Profile} />
						<Route path="/favourite" component={Favourite} />
						<Route path="/tagsearch" component={TagSearch} />
					</Switch>
					
				</div>
			</Router>
		);
	}
}

export default App;