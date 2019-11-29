import React, { Component } from 'react'
import './../App.css'
import {Link} from 'react-router-dom';
import axios from 'axios';

class Login extends Component{
  constructor(props){
    super(props);
    this.state={
      email:''
    }
    this.handleEmail = this.handleEmail.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleEmail(event) {
    this.setState({email: event.target.value});
  }

  handleClick(event){
    axios.post('http://localhost:8000/api/password_reset/', {
      "email": this.state.email,
    })
     .then((response) => {
      window.location="/" /* NEED TO FIGURE OUT WHERE TO REDIRECET*/
    });
  }
  
  render(){
    return (
      <div className="resetpassword-wrapper">
          <div class="resetpassword-container">
            <Link to="/"><h1>Recipe Scraper</h1></Link>
            <label for="email"><b>Enter Email</b></label>
            <input type="text" placeholder="Enter Email" name="email" 
               value = {this.state.email} onChange = {this.handleEmail} required ></input>

            <button type="button" onClick={this.handleClick}>Reset Password</button>
          </div>
          <div className="resetpassword-link">
            <Link to="/login">Back to Login Page</Link>
          </div>
     </div>
    );
  }

}

export default Login;

