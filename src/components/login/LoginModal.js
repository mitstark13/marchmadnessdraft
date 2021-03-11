import React, {Component} from "react";
import axios from 'axios';
import './Login.css';
const bcrypt = require('bcryptjs');

class LoginModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginSuccess: false,
      createUserSuccess: false,
      loggingIn: true,
      loginError: '',
      createUserError: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
  }

  handleChange(e) {
    const inputName = e.target.name;
    this.setState({
      [inputName]: e.target.value
    });
  }

  handleLoginSubmit(e) {
    e.preventDefault();

    // https://www.npmjs.com/package/bcryptjs

    const payload = {
      "email": this.state.emailLogin,
      "password": this.state.passwordLogin
    }

    this.loginUser(payload);
  }

  loginUser(payload) {
    axios.post(this.props.dbUrl + '/login', payload).then( async (result) => {
      if (result.data.error) {
        this.setState({ loginError: result.data.error });
      } else {
        let res = bcrypt.compareSync(payload.password, result.data.password)
        if (res) {
          this.setState({loginSuccess: true});
          setTimeout(() => {
            this.props.handleLogin(result.data);
            sessionStorage.setItem('loginId', result.data._id);
            sessionStorage.setItem('loginUsername', result.data.username);
          }, 1000);
        } else {
          this.setState({ loginError: 'Password does not match for that user' });
        }
      }
    })
  }

  encryptPassword(plainTextPassword) {
    var salt = 10;
    return bcrypt.hashSync(plainTextPassword, salt);
  }

  toggleTab(e) {
    console.log(e.target.innerHTML === 'Login');
    this.setState({ loggingIn: e.target.innerHTML === 'Login' });
  }

  createAccount(e) {
    e.preventDefault();

    const payload = {
      "username": this.state.name,
      "password": this.encryptPassword(this.state.password),
      "email": this.state.email
    }

    const loginPayload = {
      "email": this.state.email,
      "password": this.state.password
    }

    axios.post(this.props.dbUrl + '/createUser', payload).then((result) => {
      console.log(result)
      if (result.data.error) {
        this.setState({ createUserError: result.data.error });
        alert(result.data.error);
      } else {
        this.setState({createUserSuccess: true});
        this.loginUser(loginPayload);
        alert('User created: ' + this.state.name);
      }
    });
  }

  render() {
    return (
      <div className="c-login">
        {this.state.loginSuccess &&
          <div className="c-login__success">
            <p className="c-login__success-text">Successfully logged in!</p>
          </div>
        }
        <div className="c-login__container">
          <div className="c-login__tab-container" onClick={this.toggleTab}>
            <div className={!this.state.loggingIn ? "c-login__tab" : "c-login__tab active-tab"}>
                <h1 className="c-login__headline">Login</h1>
            </div>
            <div className={this.state.loggingIn ? "c-login__tab" : "c-login__tab active-tab"}>
                <h1 className="c-login__headline">Join</h1>
            </div>
          </div>
          <div className={!this.state.loggingIn ? "c-login__options form-slide" : "c-login__options"}>
            <form onSubmit={this.handleLoginSubmit}>
              <p className="c-login__message">Welcome Back!</p>
              <label className="c-login__label">
                Email:
                <input type="text" className="c-login__input" placeholder="name@email.com" name="emailLogin" onChange={this.handleChange} />
              </label>
              <label className="c-login__label">
                Password:
                <input type="password" className="c-login__input" placeholder="******" autoComplete="current-password" name="passwordLogin" onChange={this.handleChange} />
              </label>
              <input type="submit" className="c-login__submit" value="Login" />
              <small className="c-login__error">{this.state.loginError}</small>
            </form>

            <form onSubmit={this.createAccount}>
              <label className="c-login__label">
                Username:
                <input type="text" className="c-login__input" placeholder="username1" name="name" onChange={this.handleChange} />
              </label>
              <label className="c-login__label">
                Email:
                <input type="text" className="c-login__input" placeholder="name@email.com" name="email" onChange={this.handleChange} />
              </label>
              <label className="c-login__label">
                Password:
                <input type="password" className="c-login__input" placeholder="******" autoComplete="current-password" name="password" onChange={this.handleChange} />
              </label>
              <input type="submit" className="c-login__submit" value="Create Account" />
              <small className="c-login__error">{this.state.createUserError}</small>
            </form>
          </div>
          <div className="c-login__close" onClick={this.props.closeLoginModal}>
            <span>X</span>
          </div>
        </div>
      </div>
    )
  }
};

export default LoginModal;