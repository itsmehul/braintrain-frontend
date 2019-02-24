import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import {  Button, Alert} from 'react-bootstrap'

import { FormGrid } from '../../components/Grids';

const PasswordForgetPage = () => (
<FormGrid>
  <h1>Forgotten your password?</h1>
    <PasswordForgetForm />
    </FormGrid>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <form onSubmit={this.onSubmit} style={{alignSelf:'center'}}>
        {/* <FieldGroup
          controlId="formBasicText"
          name="email"
          type="email"
          value={email}
          placeholder="Enter email address"
          onChange={this.onChange}
        /> */}
        <Button onClick={this.onSubmit} disabled={isInvalid} variant="info" block>Request Change</Button>

{error && <Alert variant="warning">
  <strong>Error!</strong> {error.message}
</Alert>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <p style={{textAlign:'right'}} >
    <Link className="reset componentLink" to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);


export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink};