import React from 'react';

function TableRow({ table }) {

    const { table_id, table_name, capacity } = table;

    return (
        <tr>
            <td>{table_id}</td>
            <td>{table_name}</td>
            <td>{capacity}</td>
        </tr>
    )
}

export default TableRow;