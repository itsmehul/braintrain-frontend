import React from 'react';

import { withFirebase } from '../Firebase';

// import {Button} from 'react-bootstrap'
import Button from '@material-ui/core/Button';
import {AUTH_TOKEN} from '../../constants/authToken'
import {compose} from 'recompose'
import {withRouter} from 'react-router'
import * as ROUTES from '../../constants/routes'

const SignOutButton = ({ firebase, history }) => (
  <Button color="secondary"  onClick={()=>{firebase.doSignOut();localStorage.removeItem(AUTH_TOKEN);history.push(ROUTES.SIGN_IN)
    }} >
    Sign Out
  </Button>
);

export default compose(withFirebase,withRouter)(SignOutButton);