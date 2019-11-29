import  React, { Component } from  'react';
import RecipeService from './Recipes';


const recipeService = new RecipeService();

class RecipeList extends Component{
    constructor(props){
        super(props);
        this.state = {
            recipes: []
        };
    }
    componentDidMount(){
        var self = this;
        recipeService.getRecipes().then(function (result){
            self.setState({ recipes: result.data})
        });
    }
    render() {
        return (
			<div className = "Recipe-Page">
				<div className="searchbar-wrapper">
					<div className = "searchbar">
						<input type="text" placeholder=" Search for recipes..." />
					</div>
				</div>
				<div  className="recipes-list">
					<table  className="table" style={{display: 'flex',  justifyContent:'center', flexDirection:'column', marginLeft:'35%'}}>
						<thead  key="thead">
						<tr>
							<th>#</th>
							<th>Name</th>
							<th>Description</th>
						</tr>
						</thead>
						<tbody>
							{this.state.recipes.map( c  =>
							<tr  key={c.pk}>
								<td>{c.pk} </td>
								<td>{c.name}</td>
								<td>{c.description}</td>
								<td>{c.image}</td>
							</tr>)}
						</tbody>
					</table>
				</div>
			</div>
			
        );
    }
}
export default RecipeList;

