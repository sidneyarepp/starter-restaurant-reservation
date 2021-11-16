import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function TablesForm() {
    const [tableInfo, setTableInfo] = useState({ table_name: '', capacity: 1 });
    const [errorMessage, setErrorMessage] = useState('')
    const history = useHistory();

    function handleChange(e) {
        setTableInfo({ ...tableInfo, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:5000/tables', tableInfo)
            .then(history.push(`/dashboard`))
            .catch(error => setErrorMessage(error.response.data.error))
    }

    function handleCancel() {
        history.goBack();
    }

    return (
        <div>
            {errorMessage !== '' && <p className="alert alert-danger">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_name" className="form-label">Table Name: </label>
                <input type="text" name="table_name" className="form-control" id="table_name" value={tableInfo.table_name} onChange={handleChange} placeholder="Table Name Goes Here" required />
                <label htmlFor="capacity" className="form-label">Capacity: </label>
                <input type="number" name="capacity" className="form-control" id="capacity" min="1" value={tableInfo.capacity} onChange={handleChange} required />
                <button className="btn btn-success" type="submit">Submit</button>
                <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    )
}

export default TablesForm;