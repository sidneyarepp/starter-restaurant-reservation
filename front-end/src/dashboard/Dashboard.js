import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import { useLocation, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationRow from "./ReservationRow";
import TableRow from "./TableRow";
import axios from "axios";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  let location = useLocation().search;
  let correctDate = location.includes("?") ? location.split("=")[1] : today();
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const sortedTables = tables.sort((a, b) => {
    if (a.table_name > b.table_name) {
      return 1;
    } else if (a.table_name < b.table_name) {
      return -1;
    } else {
      return 0;
    }
  });

  useEffect(loadDashboard, [correctDate]);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    axios
      .get("http://localhost:5000/tables", {
        cancelToken: source.token,
      })
      .then(({ data }) => setTables(data.data))
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          setTablesError(error);
        }
      });
  }, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: `${correctDate}` }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function dateChange(e) {
    const id = e.target.id;
    if (id === "previous") {
      history.push(`/dashboard?date=${previous(correctDate)}`);
    } else if (id === "today") {
      history.push(`/dashboard?date=${today()}`);
    } else {
      history.push(`/dashboard?date=${next(correctDate)}`);
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
        <button className="btn btn-primary" id="previous" onClick={dateChange}>
          Previous
        </button>
        <button className="btn btn-primary" id="today" onClick={dateChange}>
          Today
        </button>
        <button className="btn btn-primary" id="next" onClick={dateChange}>
          Next
        </button>
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <ReservationRow
              key={reservation.reservation_id}
              reservation={reservation}
              reservations={reservations}
              setReservations={setReservations}
            />
          ))}
        </tbody>
      </table>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />

      <br />
      <br />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <table>
        <thead>
          <tr>
            <th>Table ID</th>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Table Status</th>
            <th>Clear Table</th>
          </tr>
        </thead>
        <tbody>
          {sortedTables.map((table) => (
            <TableRow
              key={table.table_id}
              table={table}
              tables={tables}
              setTables={setTables}
              setTablesError={setTablesError}
              reservations={reservations}
              setReservations={setReservations}
            />
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;
