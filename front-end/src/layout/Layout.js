import React, { useState } from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {

  const [reservations, setReservations] = useState([]);

  return (
    <div className="container-fluid">
      <div className="row h-100">
        <div className="col-md-2 side-bar">
          <Menu />
        </div>
        <div className="col">
          <Routes {...{ reservations, setReservations }} />
        </div>
      </div>
    </div>
  );
}

export default Layout;
