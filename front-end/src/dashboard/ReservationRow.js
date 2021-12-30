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

  //When a customer chooses to cancel an order it asks them if they're sure. If they select OK it will set the reservation to cancelled. There is also logic to handle cancelling orders from the search component. If the user is cancelling the order from the search component it updates the foundReservations state in the search functionality.
  async function handleCancel() {
    try {
      const cancelTokenSource = axios.CancelToken.source();

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
          },
          { cancelToken: cancelTokenSource.token }
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
      if (axios.isCancel(error)) {
        console.log("Request canceled");
      } else {
        console.log(error);
      }
    }
  }

  //Reservations with a status of finished or cancelled are not supposed to show on the dashboard or in search results.  This verifies if the order is in one of those statuses the reservation doesn't show.
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
                type="button"
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
