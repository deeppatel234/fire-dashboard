import React from "react";
import { NavLink } from "react-router-dom";

import Popover from "../Popover";

import "./index.scss";

interface Routes {
  title: string;
  path: string;
  exact?: boolean;
}

const routes: Routes[] = [
  {
    title: "Home",
    path: "/",
    exact: true,
  },
  {
    title: "Bookmark",
    path: "/bookmark",
  },
];

const Header = (): JSX.Element => {
  return (
    <div className="main-header">
      <Popover component={<div>Hello</div>}>
        <div className="workspace-block">
          Onlinesales.ai
          <i className="ri-arrow-down-s-line" />
        </div>
      </Popover>
      <div className="nav-block">
        {routes.map(({ title, path, ...rest }) => {
          return (
            <NavLink key={path} to={path} {...rest}>
              {title}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
