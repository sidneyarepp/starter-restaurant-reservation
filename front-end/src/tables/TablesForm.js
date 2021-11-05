import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function TablesForm() {
    const [tableInfo, setTableInfo] = useState({ table_name: '', capacity: 1 });
    const history = useHistory();

    function handleChange(e) {
        setTableInfo({ ...tableInfo, [e.target.name]: e.target.value })
    }

    function handleSubmit() {
        history.push(`/dashboard`)
    }

    function handleCancel() {
        history.goBack();
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="table_name" className="form-label">Table Name: </label>
            <input type="text" name="table_name" className="form-control" id="table_name" value={tableInfo.table_name} onChange={handleChange} placeholder="Table Name Goes Here" required />
            <label htmlFor="capacity" className="form-label">Capacity: </label>
            <input type="number" name="capacity" className="form-control" id="capacity" min="1" value={tableInfo.capacity} onChange={handleChange} required />
            <button type="submit">Submit</button>
            <button onClick={handleCancel}>Cancel</button>
        </form>
    )
}

export default TablesForm;