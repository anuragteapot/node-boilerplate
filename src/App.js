import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Checkout from "./components/Checkout";
import Forget from "./components/Forget";
import VerifyEmail from "./components/VerifyEmail";
import Dashboard from "./components/Dashboard";
import View from "./components/View";
import UserManager from "./components/UserManager";
import ResetPassword from "./components/reset-password";
import Approver from "./components/Approver";
import { SnackbarProvider } from "notistack";
import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <SnackbarProvider maxSnack={5}>
          <Route exact path="/" component={SignIn} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/pass" component={Checkout} />
          <Route exact path="/forget" component={Forget} />
          <Route exact path="/verify-email" component={VerifyEmail} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/dashboard/view/:id" component={View} />
          <Route exact path="/forget-password" component={ResetPassword} />
          <Route exact path="/approver" component={Approver} />
          <Route exact path="/dashboard/user-manager" component={UserManager} />
        </SnackbarProvider>
      </BrowserRouter>
    );
  }
}

export default App;
