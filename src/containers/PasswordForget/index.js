import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { Alert} from 'react-bootstrap'

import { FormGrid } from '../../components/Grids';
import {Button, TextField } from '@material-ui/core';

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
      <form onSubmit={this.onSubmit}>
        <TextField
						className="form_text_field"
          name="email"
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          placeholder="Enter email address"
          onChange={this.onChange}
        />
        <Button onClick={this.onSubmit} disabled={isInvalid} variant="contained">Request Change</Button>

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