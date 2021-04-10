import React from "react";

import firebase from '../../firebase';

import { Link } from 'react-router-dom';

import { Grid , Form , Button, Segment, Header, Message, Icon} from 'semantic-ui-react';


class Register extends React.Component {

  state = {
    username : '',
    email: '',
    password : '',
    passwordConfirm : ''
  }

  handleChange = event =>{
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  handleSubmit = event =>{
    event.preventDefault();
    firebase 
    .auth()
    .createUserWithEmailAndPassword(this.state.email,this.state.password)
    .then(createUser =>{
      console.log(createUser);
    })
    .catch(error =>{
      console.error(error);
    });
  }

  render() {

    const { username,email,password,passwordConfirm } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={ {maxWidth:450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange"/> Register
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input fluid 
              name="username" 
              icon="user" iconPosition="left" 
              placeholder="Username" 
              onChange={this.handleChange} type="text"
              value={username}
              />

              <Form.Input fluid name="email" icon="mail" iconPosition="left" 
              placeholder="Email" onChange={this.handleChange} type="email" value={email}/>

              <Form.Input fluid name="password" icon="lock" iconPosition="left" 
              placeholder="Password" onChange={this.handleChange} type="password" value={password}/>

              <Form.Input fluid name="passwordConfirm" icon="repeat" iconPosition="left" 
              placeholder="Password Confirmation" onChange={this.handleChange} type="password" value={passwordConfirm}/>

              <Button color="orange" fluid size="large">Submit</Button>
            </Segment>
          </Form>
          <Message>Already a user? <Link to="/login">Login</Link></Message>
        </Grid.Column>
      </Grid>
    );
     
  }
}

export default Register;
