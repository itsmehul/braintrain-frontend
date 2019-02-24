import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/styles';
import { connect } from "react-redux";
import { setSnackState } from "../../actions";
import { indigo, red } from '@material-ui/core/colors';

const mapDispatchToProps = dispatch => {
  return { setSnackState: state => dispatch(setSnackState(state)) };
};
const mapStateToProps = state => {
  return { snackState: state.myreducer.snackState };
};

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: red[500],
  },
  info: {
    backgroundColor: indigo[600],
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: '2em',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const CustSnackbar=(props) => {
  const classes = useStyles();
  const { className, snackState, setSnackState, ...other  } = props;
  const Icon = variantIcon[snackState.variant];
  function handleClose(event, reason) {
    setSnackState({open:false});
  }
  return (
    <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    open={snackState.open}
    autoHideDuration={4000}
    onClose={handleClose}
    style={{zIndex:'1600'}}
  >
    <SnackbarContent
      className={classNames(classes[snackState.variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {snackState.message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={handleClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
      </Snackbar>

  );
}

export const ReduxSnackbar = connect(mapStateToProps, mapDispatchToProps)(CustSnackbar)

CustSnackbar.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
//   variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};