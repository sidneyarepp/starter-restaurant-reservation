import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ReservationRow({ reservation }) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = reservation;

  async function handleCancel() {
    try {
      const response = window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      );
      if (response) {
        await axios.put(
          `http://localhost:5000/reservations/${reservation_id}/status`,
          {
            data: {
              status: "cancelled",
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  const correctStatus = status !== "finished" && status !== "cancelled";

  return (
    correctStatus && (
      <tr>
        <td>{reservation_id}</td>
        <td>{first_name}</td>
        <td>{last_name}</td>
        <td>{mobile_number}</td>
        <td>{reservation_date}</td>
        <td>{reservation_time}</td>
        <td>{people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {status}
        </td>
        <td>
          {status === "booked" && (
            <Link
              className="btn btn-primary"
              to={`/reservations/${reservation_id}/seat`}
            >
              Seat
            </Link>
          )}
        </td>
        <td>
          <Link
            className="btn btn-primary"
            to={`/reservations/${reservation_id}/edit`}
          >
            Edit
          </Link>
        </td>
        <td>
          <button
            className="btn btn-warning"
            onClick={handleCancel}
            data-reservation-id-cancel={reservation.reservation_id}
          >
            Cancel
          </button>
        </td>
      </tr>
    )
  );
}

export default ReservationRow;
