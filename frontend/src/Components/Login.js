import React, { Component } from 'react'
import './../App.css'
import {Link} from 'react-router-dom';
import axios from 'axios';



class Login extends Component{
  constructor(props){
    super(props);
    this.state={
      username:'',
      password:''
    }
    this.handleUser = this.handleUser.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleUser(event) {
    this.setState({username: event.target.value});
  }
  handlePass(event) {
    this.setState({password: event.target.value})
  }

  handleClick(event){

    axios.post('http://localhost:8000/api/login/', {
      "username": this.state.username, 
      "password": this.state.password,
    })
    .then((response) => {
      localStorage.setItem('currentUser', this.state.username)
      window.location="/fridge"
    
    }, (error) => {
      alert("Invalid Login")
    });
  }

  
  render(){
    return (
      <div className="login-wrapper">
          <div class="login-container">
            <Link to="/"><h1>Recipe Scraper</h1></Link>
            <label for="username"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="username" 
               value = {this.state.username} onChange = {this.handleUser} required ></input>

            <label for="password"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="password"
            value = {this.state.password} onChange = {this.handlePass}  required></input>

            <button type="button" onClick={this.handleClick}>Login</button>
          </div>
          <div className="login-links">
            <Link to="/resetpassword"> Forgot Password?</Link>
            <Link to="/register"><p>Don't Have an Account?</p></Link>
          </div>
     </div>
    );
  }

}

export default Login;

