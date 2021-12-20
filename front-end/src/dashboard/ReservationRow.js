import React from "react";
import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";

function ReservationRow({
  reservation,
  reservations,
  setReservations,
  today,
  foundReservations,
  setFoundReservations,
}) {
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

  const history = useHistory();
  const location = useLocation();
  const REACT_APP_API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  async function handleCancel() {
    try {
      const response = window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      );
      if (response) {
        await axios.put(
          `${REACT_APP_API_BASE_URL}/reservations/${reservation_id}/status`,
          {
            data: {
              status: "cancelled",
            },
          }
        );
        if (location.pathname.includes("search")) {
          setFoundReservations(
            foundReservations.filter(
              (reservation) => reservation.reservation_id !== reservation_id
            )
          );
          return;
        }
        setReservations(
          reservations.filter(
            (reservation) => reservation.reservation_id !== reservation_id
          )
        );
        history.push(`/dashboard?date=${today()}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const correctStatus = status !== "finished" && status !== "cancelled";

  return (
    correctStatus && (
      <tr>
        <td>
          {first_name} {last_name}
        </td>
        <td>{mobile_number}</td>
        <td>{reservation_date}</td>
        <td>{reservation_time}</td>
        <td>{people}</td>
        <td data-reservation-id-status={reservation_id}>{status}</td>
        <td>
          {status === "booked" && (
            <div className="d-flex flex-column">
              <Link
                className="btn btn-outline-success mb-1"
                to={`/reservations/${reservation_id}/seat`}
              >
                Seat
              </Link>

              <Link
                className="btn btn-outline-primary mb-1"
                to={`/reservations/${reservation_id}/edit`}
              >
                Edit
              </Link>

              <button
                className="btn btn-outline-danger"
                onClick={handleCancel}
                data-reservation-id-cancel={reservation.reservation_id}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
      </tr>
    )
  );
}

export default ReservationRow;
