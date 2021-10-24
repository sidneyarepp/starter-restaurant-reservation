import React from 'react';
import { Switch, Route } from 'react-router';
import ReservationForm from './ReservationForm';

function ReservationRoutes() {
    return (
        <Switch>
            <Route path="/reservations/new" exact>
                <ReservationForm />
            </Route>
        </Switch>
    )
}

export default ReservationRoutes;