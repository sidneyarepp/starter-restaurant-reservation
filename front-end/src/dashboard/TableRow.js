import React from 'react';
import axios from 'axios';

function TableRow({ table, setTables, tables }) {

    const { table_id, table_name, capacity, table_availability } = table;

    async function handleFinish() {
        try {
            await axios.delete(`http://localhost:5000/tables/${table.table_id}/seat`);
            const tablesArray = tables.filter(table => table.table_id !== table_id);
            let updatedTable = { ...table, table_availability: 'free' };
            let updatedTableArray = [...tablesArray, updatedTable];
            updatedTableArray.sort((a, b) => {
                if (a.table_name > b.table_name) {
                    return 1;
                } else if (a.table_name < b.table_name) {
                    return -1;
                } else {
                    return 0;
                };
            })
            setTables(updatedTableArray);
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <tr>
            <td>{table_id}</td>
            <td>{table_name}</td>
            <td>{capacity}</td>
            <td data-table-id-status={`${table_id}`}>{table_availability}</td>
            {table_availability === 'occupied' && <td><button className="btn btn-primary" onClick={handleFinish}>Finish</button></td>}
        </tr>
    )
}

export default TableRow;