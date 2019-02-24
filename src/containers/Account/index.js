import React from 'react';

import { AuthUserContext, withAuthorization } from '../../components/Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';


import   './styles.css'
import SignUpForm from '../../components/Forms/SignUpForm';


const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (

      <div className="page">
        Request password reset
                  <PasswordForgetForm />Change password
                  <PasswordChangeForm />
                  <SignUpForm edit={true}/>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);