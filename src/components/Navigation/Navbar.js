import React, { useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import useMedia from "../../hooks/windowHook";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import * as ROUTES from "../../constants/routes";
import SwipeableTemporaryDrawer from "./NavDrawer";
import SignOutButton from "../SignOut";
import { URL_REGEX } from "../../constants/regexfilters";
import { InputBase } from "@material-ui/core";
import { fade } from '@material-ui/core/styles/colorManipulator';
import { compose } from "recompose";
import { connect } from "react-redux";
import { setFilter } from "../../actions";
const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  toolbarRoot: {
    backgroundColor: "white",
    color: "black"
  },
  toolbarRootMobile: {
    backgroundColor: "black",
    color: "white"
  },
  navbuttonRoot: {
    color: "inherit",
    "&:hover": {
      backgroundImage: "#f5f5f5",
      color: "black"
    },
    "&:active": {
      boxShadow: "none"
    }
  },
  activenavbuttonRoot: {
    color: "inherit",
    backgroundColor: "#f5f5f5!important"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  loginbutton: {
    color: "white",
    backgroundColor: "#00bfa5"
  },
  loginbuttonactive: {
    color: "green!important",
    fontWeight: "bold!important",
    backgroundColor: "transparent!important"
  },
  loginbuttonactivemobile: {
    color: "white!important",
    backgroundColor: "transparent!important"
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Navbar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const open = Boolean(anchorEl);
  const screenSize = useMedia();

  const { classes } = props;
  let title="Braintrain"
  //   if (isMobile === true) {
  //     if ((window.location.pathname)==="/Classroom") {
  //       console.log('run')
  //     title = window.location.pathname.substr(1)
  //     }else{
  //     title = "Braintrain"
  //     }
  //   } else {
  //     title = "Braintrain"
  //   }
  

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuItemClick(event, index) {
    setSelectedIndex(index);
    setAnchorEl(null);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  const isMobile = screenSize === "mobile";
  if (props.authUser) {
    return (
      <React.Fragment>
        <AppBar
          position="static"
          style={isMobile ? null : { boxShadow: "none" }}
        >
          <Toolbar
            className={
              isMobile ? classes.toolbarRootMobile : classes.toolbarRoot
            }
          >
            {isMobile && (
              <SwipeableTemporaryDrawer
                isMobile={isMobile}
                authUser={props.authUser}
              />
            )}
            <Typography
              variant="h6"
              style={{ flexGrow: "1", color: "inherit" }}
            >
              {title}
            </Typography>
            <div style={{position:'relative', flexGrow:'2'}}>
            <div style={{position:'absolute', left:'-25px', bottom:'0'}}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              onChange={(e)=>props.setFilter(e.target.value)}
            />
          </div>
            {!isMobile && (
              <React.Fragment>
                <Button
                  component={NavLink}
                  to={ROUTES.CLASSROOMS}
                  className={classNames(classes.margin, classes.navbuttonRoot)}
                  activeClassName={classes.activenavbuttonRoot}
                >
                  Classrooms
                </Button>
                {/* <Button
                  component={NavLink}
                  to={ROUTES.HOME}
                  className={classNames(classes.margin, classes.navbuttonRoot)}
                  activeClassName={classes.activenavbuttonRoot}
                >
                  Home
                </Button> */}
              </React.Fragment>
            )}
            <div>
              <IconButton
                aria-owns={open ? "menu-appbar" : undefined}
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                style={{ zIndex: "10000" }}
              >
                <MenuItem
                  selected={1 === selectedIndex}
                  onClick={event => handleMenuItemClick(event, 1)}
                  component={NavLink}
                  to={ROUTES.ACCOUNT}
                  style={{ color: "black" }}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  selected={2 === selectedIndex}
                  onClick={event => handleMenuItemClick(event, 2)}
                  component={NavLink}
                  to={ROUTES.PROFILE}
                  style={{ color: "black" }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  selected={3 === selectedIndex}
                  onClick={event => handleMenuItemClick(event, 3)}
                >
                  <SignOutButton />
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <AppBar
          position="static"
          style={isMobile ? null : { boxShadow: "none" }}
        >
          <Toolbar
            className={
              isMobile ? classes.toolbarRootMobile : classes.toolbarRoot
            }
          >
            {isMobile && <SwipeableTemporaryDrawer isMobile={isMobile} />}
            <Typography
              variant="h6"
              style={{ flexGrow: "1", color: "inherit" }}
            >
              {isMobile ? window.location.pathname.substr(1) : "Braintrain"}
            </Typography>
            {!isMobile && (
              <React.Fragment>
                <Button
                  component={NavLink}
                  to={ROUTES.CLASSROOMS}
                  className={classNames(classes.margin, classes.navbuttonRoot)}
                  activeClassName={classes.activenavbuttonRoot}
                >
                  Classrooms
                </Button>
              </React.Fragment>
            )}
            <Button
              component={NavLink}
              to={ROUTES.SIGN_IN}
              type="contained"
              className={classes.loginbutton}
              activeClassName={
                isMobile
                  ? classes.loginbuttonactivemobile
                  : classes.loginbuttonactive
              }
            >
              SIGN IN
            </Button>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
	return {
		snackState: state.myreducer.snackState,
    user: state.myreducer.user,
    filter: state.myreducer.filter
	}
}

const mapDispatchToProps = dispatch => {
	return { setFilter: text => dispatch(setFilter(text)) }
}


export default compose(connect(mapStateToProps,mapDispatchToProps),withStyles(styles))(Navbar);
