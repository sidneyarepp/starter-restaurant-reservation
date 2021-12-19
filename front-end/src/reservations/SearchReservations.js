import React, { useState } from "react";
import axios from "axios";
import ReservationRow from "../dashboard/ReservationRow";

function SearchReservations() {
  const [searchFormText, setSearchFormText] = useState("");
  const [foundReservations, setFoundReservations] = useState([]);
  const [reservationSearchError, setReservationSearchError] = useState(null);
  const REACT_APP_API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  function handleChange(e) {
    setSearchFormText(e.target.value);
  }

  async function findReservation(e) {
    e.preventDefault();
    setFoundReservations([]);
    setReservationSearchError(null);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    await axios
      .get(
        `${REACT_APP_API_BASE_URL}/reservations?mobile_number=${searchFormText}`,
        {
          cancelToken: source.token,
        }
      )
      .then(({ data }) => {
        if (!data.data.length) {
          setReservationSearchError("No reservations found");
        } else {
          setFoundReservations(data.data);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          setReservationSearchError(error.response.data.error);
        }
      });
  }

  return (
    <div>
      <h1>Search Reservations by Phone Number</h1>
      <form onSubmit={findReservation}>
        <label htmlFor="searchBox">Search: </label>
        <input
          type="text"
          onChange={handleChange}
          value={searchFormText}
          name="mobile_number"
          placeholder="Enter a customer's phone number"
        />
        <button type="submit">Find</button>
      </form>
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
          {foundReservations.map((reservation) => (
            <ReservationRow
              key={reservation.reservation_id}
              reservation={reservation}
            />
          ))}
        </tbody>
      </table>
      {reservationSearchError && <p>{reservationSearchError}</p>}
    </div>
  );
}

export default SearchReservations;
