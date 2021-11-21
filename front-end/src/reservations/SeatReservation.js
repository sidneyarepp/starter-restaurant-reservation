import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';

function SeatReservation() {

    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null)
    const [reservation, setReservation] = useState(0);
    const [selectedTable, setSelectedTable] = useState({})
    const reservationId = Number(useLocation().pathname.split('/')[2]);
    const history = useHistory();

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        axios.get('http://localhost:5000/tables', {
            cancelToken: source.token
        })
            .then(({ data }) => setTables(data))
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message);
                } else {
                    setTablesError(error);
                }
            });
    }, [])

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        axios.get('http://localhost:5000/reservations', {
            cancelToken: source.token
        })
            .then(({ data }) => setReservation(data.data.filter(reservation => reservation.reservation_id === reservationId)[0]))
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message);
                } else {
                    setTablesError(error.response.data.error);
                }
            });
    }, [reservationId])


    function handleChange(e) {
        setSelectedTable(tables.filter(table => table.table_id === Number(e.target.value))[0]);
        setTablesError(null);
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.put(`http://localhost:5000/tables/${selectedTable.table_id}/seat`, { 'table': selectedTable, 'reservation': reservation })
            .then(response => {
                if (response.status - 200 < 100) {
                    history.push(`/dashboard`)
                }
            })
            .catch(error => setTablesError(error.response.data.error))

    }

    function handleCancel(e) {
        e.preventDefault();
        history.goBack();
    }

    return (
        <div>
            {tablesError && <p className="alert alert-danger">{tablesError}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_select">Select Table</label>
                <br />
                <select name="table_id" onChange={handleChange}>
                    <option value="none"> Please Select A Table </option>
                    {tables.map(table => <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>)}
                </select>
                <div>
                    <button className="btn btn-success" type="submit">Submit</button>
                    <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default SeatReservation;