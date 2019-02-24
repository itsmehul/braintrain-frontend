import React from "react";
import { makeStyles } from "@material-ui/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Slide } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import * as ROUTES from "../../constants/routes";
import { NavLink } from "react-router-dom";

import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

function SwipeableTemporaryDrawer({ isMobile, authUser }) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false
  });

  const toggleDrawer = (side, open) => () => {
    setState({ ...state, [side]: open });
  };

  const sideList = (
    <div className={classes.list} style={{ paddingTop: "56px" }}>
      <List>
        {authUser&&<ListItem button key={1}>
          <NavLink to={ROUTES.HOME} style={{ color: "black" }}>
            Home
          </NavLink>
        </ListItem>}
        <ListItem button key={2}>
          <NavLink to={ROUTES.CLASSROOMS} style={{ color: "black" }}>
            Classrooms
          </NavLink>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <Slide direction="right" in={isMobile} mountOnEnter unmountOnExit>
        <IconButton
          color="inherit"
          aria-label="Menu"
          onClick={toggleDrawer("left", !state.left)}
        >
          <MenuIcon />
        </IconButton>
      </Slide>
      <SwipeableDrawer
        open={state.left}
        onClose={toggleDrawer("left", false)}
        onOpen={toggleDrawer("left", true)}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer("left", false)}
          onKeyDown={toggleDrawer("left", false)}
        >
          {sideList}
        </div>
      </SwipeableDrawer>
    </div>
  );
}

export default SwipeableTemporaryDrawer;
