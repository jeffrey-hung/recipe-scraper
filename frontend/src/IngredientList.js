import  React, { Component } from  'react';
import IngredientService from './Ingredients';

const ingredientService = new IngredientService();

class IngredientList extends Component{
    constructor(props){
        super(props);
        this.state = {
            ingredients: []
        };
    }
    componentDidMount(){
        var self = this;
        ingredientService.getIngredients().then(function (result){
            self.setState({ ingredients: result.data})
        });
    }
    render() {
    
        return (
        <div  className="ingredient-list">
            <table  className="table" style={{display: 'flex',  justifyContent:'center'}}>
                <thead  key="thead">
                <tr>
                    <th>#</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                    {this.state.ingredients.map( c  =>
                    <tr  key={c.pk}>
                        <td>{c.name}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
        );
    }
}
export default IngredientList;

