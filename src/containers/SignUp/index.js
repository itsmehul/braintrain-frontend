import React from "react";
import * as ROUTES from "../../constants/routes";
import { Link } from "react-router-dom";
import {Paper} from '@material-ui/core'
//PASSWORDS STRENGTH LIB
import { FormGrid } from "../../components/Grids";
import SignUpForm from "../../components/Forms/SignUpForm";
import BackgroundImage from "../../components/BackgroundImage";
import { SignInLink } from "../SignIn";


//COMPOSE THE COMPONENTS
const SignUpPage = () => (
  <React.Fragment>
    <BackgroundImage path='/assets/login-background.jpg'/>
      <FormGrid>
        <Paper className="form" style={{margin:'5em 0 1em 0'}}>
        <h1 >Please enter your details</h1>
        <SignUpForm />
        <SignInLink/>
        </Paper>
      </FormGrid>
  </React.Fragment>
);


//SPECIFY LINK TO COMPONENT
const SignUpLink = () => (
  <p style={{textAlign:'right'}}>
    <Link className='componentLink' to={ROUTES.SIGN_UP}>or Create an Account</Link>
  </p>
);

//EXPORT THE COMPOSED COMPONENT
export default SignUpPage;

//EXPORT LINK AND FORM COMPONENT FOR REUSE
export { SignUpForm, SignUpLink };
