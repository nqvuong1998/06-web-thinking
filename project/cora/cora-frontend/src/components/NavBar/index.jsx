import React from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import * as gameActions from "../../actions";


import '../../styles/NavBar/navbar.css';
import {message} from 'antd'

class NavBarComp extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this
      .toggle
      .bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logOut = ()=>{

    let user = {
      id: 0,
      username:"xxxx",
      money: 0,
      token:"abcxyz",
      isAuth: false
    }
    this.props.actions.updateUser(user);
    localStorage.removeItem("userInfo");
    message.success("Log out!");
  }

  getHistory(){
    message.success("Get history!");
  }

  render() {
    return (
      <div>
        <Navbar className="navbar-header" color="dark" dark expand="md">
          <NavbarBrand href="/" className="cora">Cora</NavbarBrand>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem >
                <NavLink href="/" className="nav-item-header-money">Money: <span className="value">${this.props.user.money}</span></NavLink>
              </NavItem>
              
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="nav-item-header-user">
                  {this.props.user.username}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                   <button className="btn-dropdowns" onClick={this.getHistory}>History</button>
                  </DropdownItem>
    
                  <DropdownItem divider/>
                  <DropdownItem>
                    <button className="btn-dropdowns" onClick={this.logOut}>Log out</button>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

  
}

const mapStateToProps = state => (
  {
    user:state.user
  }
);

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  };
};

let NavBar = connect(mapStateToProps,mapDispatchToProps)(NavBarComp);
export default NavBar;