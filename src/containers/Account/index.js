import React from 'react';

import { AuthUserContext, withAuthorization } from '../../components/Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';


import './styles.css'
import SignUpForm from '../../components/Forms/SignUpForm';
import { FormGrid } from '../../components/Grids';


const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', justifyItems:'center', alignItems:'center',marginTop:'56px'}}>
                  <div style={{width:'200px'}}>
                    <PasswordForgetForm />
                  </div>
                  <div style={{width:'200px'}}>
                    <PasswordChangeForm />
                  </div>
                  <div style={{width:'200px'}}>
                  <SignUpForm edit={true}/></div>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);