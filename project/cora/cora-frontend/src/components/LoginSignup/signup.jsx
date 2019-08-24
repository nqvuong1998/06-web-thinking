import React from 'react'
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  Container
} from 'reactstrap';

import "antd/dist/antd.css";
import "../../styles/LoginSignup/signup.css";
import bg from '../../resources/bg-signup.png';
import { message } from 'antd';
import axios from 'axios'
import {API_SIGNUP} from '../../constants/variable'

class Header extends React.Component {

  handleSubmit(e) {
    e.preventDefault();
    console.log("username: " + e.target.username.value);
    console.log("password: " + e.target.password.value);
    console.log("confirm: " + e.target.confirm.value);
    
    if (e.target.password.value!==e.target.confirm.value){
      message.error("Password does not match!");
    }
    else{

      axios.post(API_SIGNUP, {
        username: e.target.username.value,
        password: e.target.password.value
      })
      .then((response)=> {
        console.log(response);
        if (response.data.status === "error"){
          message.error(response.data.message);
        }else{
          message.success("Sign up successfully!");
        }
      })
      .catch((error) => {
        console.log(error);
        message.error("Sign up fail!")
        
      });
    }
  }

  render() {
    return (
      <div className="signup">
        <Container>
          <Row>
            <Col className="box-img"><img className="imageGame" src={bg} width="400px" height="400px" alt=""/></Col>
            <Col>
              <form className="form-signup">

                <h2 className="title-signup">Create new account</h2>

                <Form onSubmit={this.handleSubmit}>
                  <FormGroup className="form-group">
                    <Input
                      type="text"
                      name="username"
                      className="input-username"
                      placeholder="Enter username"
                      title="Must contain letter, and at least 4, at max 8"
                      pattern="(?=.*[a-z]).{4,8}"
                      required/>
                  </FormGroup>
                  <FormGroup className="form-group">
                    <Input
                      type="password"
                      name="password"
                      className="input-password"
                      placeholder="Enter password"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,16}"
                      title="Must contain at least one number and one uppercase and lowercase letter, at least 4, and at max 16 "
                      required/>
                  </FormGroup>
                  <FormGroup className="form-group">
                    <Input
                      type="password"
                      className="input-password"
                      name="confirm"
                      placeholder="Confirm password"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,16}"
                      title="Must contain at least one number and one uppercase and lowercase letter, at least 4, and at max 16 "
                      required/>
                  </FormGroup>
                  <Button type="submit" color="success" className="btn-signup">Sign up</Button>
                </Form>

              </form>
            </Col>
          </Row>
        </Container>

      </div>
    )
  }
};

export default Header;