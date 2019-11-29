import React, { Component } from 'react'
import './../App.css'
import {Link} from 'react-router-dom';
import axios from 'axios';

class Register extends Component{
  constructor(props){
    super(props);
    this.state={
      email:'',
      username:'',
      password:'',
      password2:'',
    }
    this.handleEmail = this.handleEmail.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handlePass2 = this.handlePass2.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleEmail(event) {
    this.setState({email: event.target.value});
  }
  handleUser(event) {
    this.setState({username: event.target.value})
  }
  handlePass(event) {
    this.setState({password: event.target.value})
  }
  handlePass2(event) {
    this.setState({password2: event.target.value})
  }

  handleClick(event){
    if(this.state.password !== this.state.password2){
      alert("Passwords do not match!")

    }else{
      axios.post('http://localhost:8000/api/register/', {
        "email": this.state.email,
        "username": this.state.username,
        "password": this.state.password,
        "password2": this.state.password2,
    })
      .then((response) => {
        axios.post('http://localhost:8000/api/login/', {
          "username": this.state.username,
          "password": this.state.password,
        })
        .then((response) => {
          alert("Logging In")
          localStorage.setItem('currentUser', this.state.username)
          window.location="/fridge"
         });   

      }, (error) => {
        alert("User Already Exists!")
      });
    }
}
  
  render(){
    return (
      <div className="register-wrapper">
          <div class="register-container">
            <Link to="/"><h1>Recipe Scraper</h1></Link>

            <label for="email"><b>Email</b></label>
            <input type="text" placeholder="Enter Email" name="email" 
               value = {this.state.email} onChange = {this.handleEmail} required ></input>

            <label for="username"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="username" 
               value = {this.state.username} onChange = {this.handleUser} required ></input>

            <label for="password"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="password"
            value = {this.state.password} onChange = {this.handlePass}  required></input>

            <label for="password2"><b>Re-enter Password</b></label>
            <input type="password" placeholder="Re-enter Password" name="password2"
            value = {this.state.password2} onChange = {this.handlePass2}  required></input>

            <button type="button" onClick={this.handleClick}>Register</button>
            <Link to="/login"><p>Back to Login Page</p></Link>
          </div>
      </div>
    
    );
  }

}

export default Register;

