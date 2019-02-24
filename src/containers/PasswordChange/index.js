import React, { Component } from 'react';

import { withFirebase } from '../../components/Firebase';
import zxcvbn from 'zxcvbn'
import {ProgressBar, Button, Alert} from 'react-bootstrap'

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
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


  getValidationState(val) {
    let label;
    let value_quality;
    switch (val) {
      case "passwordOne": {
        let score = zxcvbn(this.state.passwordOne).score
        if (score === 0 && this.state.passwordOne.length > 0) { value_quality = 'error'; label = 'Password atleast 6 characters long' }
        else if (score === 1) { value_quality = 'warning'; label = 'Almost there' }
        else if (score === 2) { value_quality = 'success'; label = 'Good password' }
        break
      }
      case "passwordTwo": {
        if (this.state.passwordOne !== this.state.passwordTwo && this.state.passwordTwo.length > 0) { value_quality = "error"; label = `Passwords don't match` } else if (this.state.passwordTwo.length > 0) { value_quality = "success"; label = `Passwords match!` }
        break;
      }
      default:{
        value_quality= null; label= ''
      }
    }
    return { value_quality, label };
  }

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        {/* <FieldGroup
          controlId="formBasicText"
          name="passwordOne"
          type="password"
          value={passwordOne}
          placeholder="Enter password"
          onChange={this.onChange}
          label={this.getValidationState('passwordOne').label}
        />{this.state.passwordOne.length > 0 &&
          <ProgressBar variant={this.getValidationState('passwordOne').value_quality === 'error' ? 'danger' :
            this.getValidationState('passwordOne').value_quality === 'warning' ? 'warning' : 'success'} now={
              this.getValidationState('passwordOne').value_quality === 'danger' ? 45 :
                this.getValidationState('passwordOne').value_quality === 'warning' ? 65 : 100
            } />}
        <FieldGroup
          controlId="formBasicText"
          name="passwordTwo"
          type="password"
          value={passwordTwo}
          placeholder="Enter the same password"
          onChange={this.onChange}
          label={this.getValidationState('passwordTwo').label}
        /> */}
        <Button onClick={this.onSubmit} disabled={isInvalid} variant="primary" block>Confirm new password</Button>

{error && <Alert variant="warning">
  <strong>Error!</strong> {error.message}
</Alert>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);