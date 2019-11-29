import React, {Component} from 'react'
import './../App.css'
import Navbar from './Navbar'
import axios from 'axios';
import pic from './pic.jpg'

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmpassword: '',
            email: '',
            showPassword: false,
            showPopUp: false,    
        };
    }

    componentDidMount(){
        const user = localStorage.getItem('currentUser')
        console.log({"user": user})
        if (user === '') {
            console.log("Unauthorised user")
        } else  {
            axios.post('http://localhost:8000/api/favourite_list/', {"user": user}).then(response => {
                this.setState({favouriterecipes: response.data['recipes']})
            }); 
        }
    }

    changeEmail(event) {
        const email = this.state.email;
        const user = localStorage.getItem('currentUser')
        axios.post('http://localhost:8000/api/change_email/', {"user": user, "email":email})
    }

    changePassword(event) {
        const password = this.state.password;
        if (this.state.password !== this.state.confirmpassword) {
            alert("Passwords don't match")
        } else {
            const user = localStorage.getItem('currentUser')
            axios.post('http://localhost:8000/api/change_password/', {"user": user, "password":password})
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    toggleShow() {
        this.setState({ showPassword: !this.state.showPassword });
    }


    render() {

        return (
			<div className="profile-wrapper">
				<Navbar />
				<div className="test-wrapper">
					<img src={pic}></img>
					<div className="change-password">
						<h1>Change your password</h1>
						<input type={this.state.showPassword ? "text" : "password"} id="password" placeholder="Change Password" value={this.state.password} onChange={this.handleChange}></input>
						<input type={this.state.showPassword ? "text" : "password"} id="confirmpassword" placeholder="Confirm Password" value={this.state.confirmpassword} onChange={this.handleChange}></input>
						<button onClick={this.changePassword.bind(this)} value="Password">Set Password</button> 
						<button onClick={this.toggleShow.bind(this)}>Show / Hide</button>
						<h1>Change your email</h1>
						<input type="email" id="email" placeholder="Change Email" value={this.state.email} onChange={this.handleChange}></input>
						<button onClick={this.changeEmail.bind(this)} value="Password">Set Email</button>

					</div>
				</div>
			</div>
        );
    }
}

export default Profile;
