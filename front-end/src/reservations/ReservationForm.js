import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

function ReservationForm() {
  const [reservationInfo, setReservationInfo] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
    timezoneOffset: new Date().getTimezoneOffset() * 60 * 1000,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  const REACT_APP_API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  function handleChange(e) {
    if (e.target.name === "people") {
      setReservationInfo({
        ...reservationInfo,
        [e.target.name]: Number(e.target.value),
      });
    } else {
      setReservationInfo({
        ...reservationInfo,
        [e.target.name]: e.target.value,
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post(`${REACT_APP_API_BASE_URL}/reservations`, {
        data: reservationInfo,
      })
      .then((response) => {
        if (response.status - 200 < 100) {
          history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
        }
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
      });
  }

  function handleCancel() {
    history.goBack();
  }

  return (
    <div>
      {errorMessage !== "" && (
        <p className="alert alert-danger">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name" className="form-label">
          First Name:
        </label>
        <input
          type="text"
          name="first_name"
          className="form-control"
          id="first_name"
          value={reservationInfo.first_name}
          onChange={handleChange}
          placeholder="John"
          required
        />
        <label htmlFor="last_name" className="form-label">
          Last Name:
        </label>
        <input
          type="text"
          name="last_name"
          className="form-control"
          id="last_name"
          value={reservationInfo.last_name}
          onChange={handleChange}
          placeholder="Smith"
          required
        />
        <label htmlFor="mobile_number" className="form-label">
          Mobile Number:
        </label>
        <input
          type="tel"
          name="mobile_number"
          className="form-control"
          id="mobile_number"
          value={reservationInfo.mobile_number}
          onChange={handleChange}
          placeholder="555-123-4567"
          required
        />
        <label htmlFor="reservation_date" className="form-label">
          Reservation Date:
        </label>
        <input
          type="date"
          name="reservation_date"
          className="form-control"
          id="reservation_date"
          value={reservationInfo.reservation_date}
          onChange={handleChange}
          required
        />
        <label htmlFor="reservation_time" className="form-label">
          Reservation Time:
        </label>
        <input
          type="time"
          name="reservation_time"
          className="form-control"
          id="reservation_time"
          value={reservationInfo.reservation_time}
          onChange={handleChange}
          required
        />
        <label htmlFor="people" className="form-label">
          Number of People In the Party:
        </label>
        <input
          type="number"
          name="people"
          className="form-control"
          id="people"
          min={1}
          value={reservationInfo.people}
          onChange={handleChange}
          required
        />
        <button className="btn btn-success" type="submit">
          Submit
        </button>
        <button className="btn btn-danger" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
