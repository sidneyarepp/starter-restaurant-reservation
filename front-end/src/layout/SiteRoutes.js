import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationRoutes from "../reservations/ReservationRoutes";
import SearchReservations from "../reservations/SearchReservations";
import TablesForm from "../tables/TablesForm";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function SiteRoutes() {
  return (
    <Routes>
      <Route exact={true} path="/" element={<Navigate to={"/dashboard"} />} />
      <Route path="/reservations/*" element={<ReservationRoutes />} />
      <Route path="/tables/new" exact element={<TablesForm />} />
      <Route path="/search" element={<SearchReservations />} />
      <Route path="/dashboard" element={<Dashboard date={today()} />} />
      <Route element={<NotFound />} />
    </Routes>
  );
}

export default SiteRoutes;
