import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import { useLocation, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationRow from "./ReservationRow";
import TableRow from "./TableRow";
import axios from "axios";
import "./Dashboard.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const REACT_APP_API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
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
      .get(`${REACT_APP_API_BASE_URL}/tables`, {
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
    <main className="text-center">
      <div className="tableHeads p-3 mt-3">
        <h1 className="text-light">Dashboard</h1>
        <h5 className="mb-3 text-center">
          Reservations for date: {correctDate}
        </h5>
        <div className="d-flex justify-content-around mb-2">
          <button
            className="btn btn-info dateButtons"
            id="previous"
            onClick={dateChange}
          >
            Previous Day
          </button>
          <button
            className="btn btn-info dateButtons"
            id="today"
            onClick={dateChange}
          >
            Current Day
          </button>
          <button
            className="btn btn-info dateButtons"
            id="next"
            onClick={dateChange}
          >
            Next Day
          </button>
        </div>
      </div>
      <div className="d-md-flex mt-3">
        <h4 className="mb-0">Reservations:</h4>
      </div>
      <table className="table table-striped">
        <thead className="thead tableHeads">
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Date</th>
            <th>Time</th>
            <th># of People</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <ReservationRow
              key={reservation.reservation_id}
              reservation={reservation}
              reservations={reservations}
              setReservations={setReservations}
              today={today}
            />
          ))}
        </tbody>
      </table>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />

      <div className="d-md-flex mt-4">
        <h4 className="mb-0">Tables: </h4>
      </div>
      <table className="table table-striped">
        <thead className="thead tableHeads">
          <tr>
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
