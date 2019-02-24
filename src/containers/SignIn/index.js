import React from "react";
import * as ROUTES from "../../constants/routes";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { FormGrid } from "../../components/Grids";
import SignInForm from "../../components/Forms/SignInForm";
import BackgroundImage from "../../components/BackgroundImage";
import {Paper} from '@material-ui/core'
import {Link} from 'react-router-dom'

const SignInPage = () => (
  <React.Fragment>
    <BackgroundImage path='/assets/login-background.jpg'/>
    <FormGrid>
      <Paper className="form">
      <h1>SignIn</h1>
      <SignInForm />
      <PasswordForgetLink />
      <SignUpLink />
      </Paper>
    </FormGrid>
  </React.Fragment>
);

const SignInLink = () => (
  <p style={{textAlign:'right'}}>
    <Link className='componentLink' to={ROUTES.SIGN_IN}>Already have an account?</Link>
  </p>
);

export {SignInLink}

export default SignInPage;

