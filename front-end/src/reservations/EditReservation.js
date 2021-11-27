import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';

function EditReservation() {

    const [reservationInfo, setReservationInfo] = useState({ first_name: '', last_name: '', mobile_number: '', reservation_date: '', reservation_time: '', people: 0, reservation_id: '', status: '', created_at: '', updated_at: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const reservationId = Number(useLocation().pathname.split('/')[2]);
    const { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = reservationInfo;
    const history = useHistory();

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        axios.get('http://localhost:5000/reservations', {
            cancelToken: source.token
        })
            .then(({ data }) => {
                const reservationInfo = (data.data.filter(reservation => reservation.reservation_id === reservationId)[0])
                const date = reservationInfo.reservation_date.slice(0, 10);
                setReservationInfo({ ...reservationInfo, reservation_date: date })
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message);
                } else {
                    setErrorMessage(error);
                }
            });
    }, [reservationId])

    function formatPhoneNumber(value) {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, "");
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
            3,
            6
        )}-${phoneNumber.slice(6, 10)}`;
    }

    function handleChange(e) {
        if (e.target.name === 'mobile_number') {
            setReservationInfo({ ...reservationInfo, [e.target.name]: formatPhoneNumber(e.target.value) })
        } else {
            setReservationInfo({ ...reservationInfo, [e.target.name]: e.target.value })
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.put('http://localhost:5000/reservations/:reservation_id/edit', reservationInfo)
            .then(response => {
                if (response.status - 200 < 100) {
                    history.goBack();
                }
            })
            .catch(error => setErrorMessage(error.response.data.error));
    }

    function handleCancel() {
        history.goBack()
    }

    return (
        <div>
            {errorMessage !== '' && <p className="alert alert-danger">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="first_name" className="form-label">First Name: </label>
                <input type="text" name="first_name" className="form-control" id="first_name" value={first_name} onChange={handleChange} placeholder="John" required />
                <label htmlFor="last_name" className="form-label">Last Name: </label>
                <input type="text" name="last_name" className="form-control" id="last_name" value={last_name} onChange={handleChange} placeholder="Smith" required />
                <label htmlFor="mobile_number" className="form-label">Mobile Number: </label>
                <input type="tel" name="mobile_number" className="form-control" id="mobile_number" value={mobile_number} onChange={handleChange} placeholder="555-123-4567" required />
                <label htmlFor="reservation_date" className="form-label">Reservation Date: </label>
                <input type="date" name="reservation_date" className="form-control" id="reservation_date" value={reservation_date} onChange={handleChange} required />
                <label htmlFor="reservation_time" className="form-label">Reservation Time: </label>
                <input type="time" name="reservation_time" className="form-control" id="reservation_time" value={reservation_time} onChange={handleChange} required />
                <label htmlFor="people" className="form-label">Number of People In the Party</label>
                <input type="number" name="people" className="form-control" id="people" min="1" value={people} onChange={handleChange} required />
                <button className="btn btn-success" type="submit">Submit</button>
                <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    )
}

export default EditReservation;