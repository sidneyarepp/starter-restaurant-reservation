import React from 'react';
import { Switch, Route } from 'react-router';
import ReservationForm from './ReservationForm';
import SeatReservation from './SeatReservation';

function ReservationRoutes() {
    return (
        <Switch>
            <Route path="/reservations/new" exact>
                <ReservationForm />
            </Route>
            <Route path="/reservations/:reservation_id/seat" exact>
                <SeatReservation />
            </Route>
        </Switch>
    )
}

export default ReservationRoutes;