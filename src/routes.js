import React, { Fragment } from "react";
//PublicLayout,
import { PrivateLayout,  NotLoggedInLayout } from "@layouts";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
//import { Route } from "react-router-dom";

import {
  Login,
  Register,
  Welcome,
  RegistrationSuccess,
  Profile,
  UpdateLocation,
  FindMyFriendSearch,
  RestaurantSearch
} from "./containers";

const privateRoutes = [
  {
    id: "welcome",
    path: "/welcome",
    component: Welcome
  },
  {
    id: "profile",
    path: "/profile",
    component: Profile
  },
  {
    id: "restaurantSearch",
    path: "/restaurantSearch",
    component: RestaurantSearch
  },
  {
    id: "location",
    path: "/updateLocation",
    component: UpdateLocation
  },
      {
    id: "FindMyFriend",
    path: "/findMyFriend",
    component: FindMyFriendSearch
  }
];

const Routes = () => (
  <Router>
    <Fragment>
      <Switch>
        <NotLoggedInLayout component={Login} path="/login" exact />
        <NotLoggedInLayout component={Register} path="/register" exact />
        <NotLoggedInLayout
          path="/register/success"
          component={RegistrationSuccess}
          exact
        /> 
        <Redirect from="/" to="/Welcome" exact />

        <PrivateLayout path="/" routes={privateRoutes} />
        <Redirect to="/404" />

      </Switch>
    </Fragment>
  </Router>
);

export default Routes;
