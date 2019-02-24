import React from "react";
import { AuthUserContext } from "../../components/Session";
import Navbar from "./Navbar";

const Navigation = () => (
  <div style={{ position: "relative", zIndex: "1400" }}>
    <AuthUserContext.Consumer>
      {authUser => (authUser ? <Navbar authUser={authUser} /> : <Navbar />)}
    </AuthUserContext.Consumer>
  </div>
);

export default Navigation;
