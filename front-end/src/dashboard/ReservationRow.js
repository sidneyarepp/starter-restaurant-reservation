import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ReservationRow({ reservation, tablesReservationChange, setTablesReservationChange }) {

    const { reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status } = reservation;


    function handleSeating() {
        axios.put(`http://localhost:5000/reservations/${reservation_id}/status`, { data: { 'status': 'seated', 'reservation_id': reservation_id } })
        setTablesReservationChange(tablesReservationChange + 1)
    }


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
            <td>{status === 'booked' && <Link className='btn btn-primary' to={`/reservations/${reservation_id}/seat`} onClick={handleSeating}>Seat</Link>}</td>
        </tr>
    )
}

export default ReservationRow;