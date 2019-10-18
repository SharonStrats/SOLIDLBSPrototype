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
  Location,
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
    id: "location",
    path: "/location",
    component: Location
  },
    {
    id: "FindMyFriend",
    path: "/findMyFriend",
    component: FindMyFriendSearch
  },
  {
    id: "restaurantSearch",
    path: "/restaurantSearch",
    component: RestaurantSearch
  }

];
//SAM 8/21 Added the line below to get it to go to restaurant search
//Need to look into how to add it to Private or Public Route.
//<Redirect from="/" to="/restaurantSearch" exact />
//<Route path="/restaurantSearch" component={RestaurantSearch} />
 //      <PublicLayout path="/404" component={PageNotFound} exact />
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
        
        <Redirect from="/" to="/restaurantSearch" exact />
        <Redirect from="/friends" to="/findMyFriend" exact />
        
        <PrivateLayout path="/" routes={privateRoutes} />
        <Redirect to="/404" />

      </Switch>
    </Fragment>
  </Router>
);

export default Routes;
