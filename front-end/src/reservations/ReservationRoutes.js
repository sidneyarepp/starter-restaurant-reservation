import React from "react";
import { Route, Routes } from "react-router";
import ReservationForm from "./ReservationForm";
import SeatReservation from "./SeatReservation";
import EditReservation from "./EditReservation";

function ReservationRoutes() {
  return (
    <Routes>
      <Route path="/new" exact element={<ReservationForm />} />
      <Route path="/:reservation_id/seat" exact element={<SeatReservation />} />
      <Route path="/:reservation_id/edit" exact element={<EditReservation />} />
    </Routes>
  );
}

export default ReservationRoutes;
