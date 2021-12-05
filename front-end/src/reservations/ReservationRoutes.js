import React from "react";
import { Route, Switch } from "react-router";
import ReservationForm from "./ReservationForm";
import SeatReservation from "./SeatReservation";
import EditReservation from "./EditReservation";

function ReservationRoutes() {
  return (
    <Switch>
      <Route path="/reservations/new" exact>
        <ReservationForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat" exact>
        <SeatReservation />
      </Route>
      <Route path="/reservations/:reservation_id/edit" exact>
        <EditReservation />
      </Route>
    </Switch>
  );
}

export default ReservationRoutes;
