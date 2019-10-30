import React from "react";
import { NavBar } from "@components";

import { NavBarProfile } from "./children";
import { LanguageDropdown } from "@util-components";

const AuthNavBar = props => {
  const { t } = props;
  const navigation = [
    {
      id: "welcome",
      icon: "img/icon/apps.svg",
      label: t("navBar.welcome"),
      to: "/welcome"
    },
    {
      id: "profile",
      icon: "img/people.svg",
      label: t("navBar.profile"),
      to: "/profile"
    },
    {
      id: "findmyfriend",
      icon: "img/friend-search.svg",
      label: t("FindMyFriends"),
      to: "/findMyFriend"
    },
    {
      id: "location",
      icon: "img/maps-and-location.svg",
      label: t("UpdateLocation"),
      to: "/updateLocation"
    },
    {
      id: "restaurant",
      icon: "img/restaurant-search.svg",
      label: t("RestaurantSearch"),
      to: "/restaurantSearch"
    }
  ];
  return (
    <NavBar
      navigation={navigation}
      toolbar={[
        {
          component: () => <LanguageDropdown {...props} />,
          id: "language"
        },
        {
          component: ({open, customClass}) => <NavBarProfile {...props} open={open} customClass={customClass} />,
          id: "profile"
        }
      ]}
    />
  );
};

export default AuthNavBar;
