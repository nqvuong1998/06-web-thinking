import React, {Component} from 'react';
import './App.css';

import Rooms from './Rooms'
import LoginSignup from './LoginSignup'
import Game from './Game'
import {BrowserRouter as Router, Route, Redirect, withRouter} from "react-router-dom";
import {connect} from 'react-redux'

class App extends Component {

  state={
    isAuth:false
  }

  componentWillMount(){

    const userTmp = JSON.parse(localStorage.getItem("userInfo"));
      if (userTmp){
        if (userTmp.isAuth){
          this.setState({isAuth:true})
          return;
        }
      }
  }

  componentWillReceiveProps=props=>{
    if (props.user.isAuth){
      this.setState({isAuth:true})
      return;
    }else{
      this.setState({isAuth:false})
    }
  }

  render() {
    
    return (
      <div className="App">
        <Router>
          <div>
            {/* <AuthButton/> */}

            <Redirect
              to={{
              pathname: "/rooms",
              state: {
                from: "/"
              }
            }}/>

            <Route path="/login" component={LoginSignup}/>
            <PrivateRoute auth={this.state.isAuth} path="/rooms" component={Rooms}/>
            <PrivateRoute auth={this.state.isAuth} path="/play" component={Game}/>
          </div>
        </Router>

      </div>
    );
  }
}

function PrivateRoute({
  component: Component,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={props => rest.auth
      ? (<Component {...props}/>)
      : (<Redirect
        to={{
        pathname: "/login",
        state: {
          from: props.location
        }
      }}/>)}/>
  );
}




const mapStateToProps = state => (
  {
    user:state.user
  }
);

export default connect(mapStateToProps)(App);