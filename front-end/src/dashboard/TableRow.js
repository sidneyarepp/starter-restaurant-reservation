import React from 'react';
import axios from 'axios';

function TableRow({ table }) {

    const { table_id, table_name, capacity, table_availability } = table;

    function handleFinish() {
        axios.delete(`http://localhost:5000/tables/${table.table_id}/seat`)
            .catch(error => console.log(error))
    }

    return (
        <tr>
            <td>{table_id}</td>
            <td>{table_name}</td>
            <td>{capacity}</td>
            <td data-table-id-status={`${table_id}`}>{table_availability}</td>
            {table_availability === 'Occupied' && <td><button className="btn btn-primary" onClick={handleFinish}>Finish</button></td>}
        </tr>
    )
}

export default TableRow;