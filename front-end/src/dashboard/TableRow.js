import React from "react";
import axios from "axios";

function TableRow({
  table,
  tables,
  setTables,
  setTablesError,
  reservations,
  setReservations,
}) {
  const { table_id, table_name, capacity, reservation_id, table_availability } =
    table;

  async function handleFinish() {
    try {
      const response = window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      );
      if (response) {
        await axios.delete(
          `http://localhost:5000/tables/${table.table_id}/seat`
        );

        // await axios.put(
        //   `http://localhost:5000/reservations/${reservation_id}/status`,
        //   {
        //     data: {
        //       status: "finished",
        //     },
        //   }
        // );
        await axios.get(`http://localhost:5000/tables`);

        const tablesArray = tables.filter(
          (table) => table.table_id !== table_id
        );
        const updatedTable = {
          ...table,
          table_availability: "free",
          reservation_id: null,
        };
        const updatedTablesArray = [...tablesArray, updatedTable];

        const reservationsArray = reservations.filter(
          (reservation) => reservation.reservation_id !== reservation_id
        );

        const tableReservation = reservations.filter(
          (reservation) => reservation.reservation_id === reservation_id
        );

        const updatedReservation = {
          ...tableReservation[0],
          status: "finished",
        };
        const updatedReservationArray = [
          ...reservationsArray,
          updatedReservation,
        ];

        setTables(updatedTablesArray);
        setReservations(updatedReservationArray);
      }
    } catch (error) {
      setTablesError(error.response.data.error);
    }
  }

  return (
    <tr>
      <td>{table_name}</td>
      <td>{capacity}</td>
      <td data-table-id-status={table.table_id}>{table_availability}</td>
      <td>
        {table.reservation_id && (
          <button
            data-table-id-finish={table_id}
            className="btn btn-primary"
            onClick={handleFinish}
          >
            Finish
          </button>
        )}
      </td>
    </tr>
  );
}

export default TableRow;
