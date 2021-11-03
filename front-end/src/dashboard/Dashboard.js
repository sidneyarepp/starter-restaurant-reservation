import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import { useLocation, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  let location = useLocation().search;
  let correctDate = location.includes('?') ? location.split('=')[1] : today();
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [correctDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: `${correctDate}` }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function dateChange(e) {
    const id = e.target.id
    if (id === 'previous') {
      history.push(`/dashboard?date=${previous(correctDate)}`)
    } else if (id === 'today') {
      history.push(`/dashboard?date=${today()}`)
    } else {
      history.push(`/dashboard?date=${next(correctDate)}`)
    }

  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <div>
        <p>{correctDate}</p>
        <button id='previous' onClick={dateChange}>Previous</button>
        <button id='today' onClick={dateChange}>Today</button>
        <button id='next' onClick={dateChange}>Next</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>Party Size</th>
            <th>Created Date/Time</th>
            <th>Updated Date/Time</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
