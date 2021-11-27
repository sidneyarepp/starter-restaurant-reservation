import React from 'react';
import { Link } from 'react-router-dom';

function ReservationRow({ reservation }) {

    const { reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status } = reservation;

    return (
        status !== "finished" &&
        <tr>
            <td>{reservation_id}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{mobile_number}</td>
            <td>{reservation_date}</td>
            <td>{reservation_time}</td>
            <td>{people}</td>
            <td data-reservation-id-status={reservation.reservation_id}>{status}</td>
            <td>{status === 'booked' && <Link className='btn btn-primary' to={`/reservations/${reservation_id}/seat`}>Seat</Link>}</td>
            <td>{<Link className='btn btn-primary' to={`/reservations/${reservation_id}/edit`}>Edit</Link>}</td>
        </tr>
    )
}

export default ReservationRow;