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

  const REACT_APP_API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  //Envokes the controller function that sets the status of the reservation to finished, status of the table to free, and removes the reservation id from the table.
  async function handleFinish() {
    try {
      const response = window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      );
      if (response) {
        await axios.delete(
          `${REACT_APP_API_BASE_URL}/tables/${table.table_id}/seat`
        );

        await axios.get(`${REACT_APP_API_BASE_URL}/tables`);

        //Creating a new array of all the tables that aren't being finished by using the Dashboard tables state.
        const tablesArray = tables.filter(
          (table) => table.table_id !== table_id
        );

        //Taking the current table being changed, passed down from the dashboard, and changing the table_availability and reservation_id values.
        const updatedTable = {
          ...table,
          table_availability: "free",
          reservation_id: null,
        };

        //Creating a new array of all non-edited tables, as well as the edited table, to use for changing dashboard tables state.
        const updatedTablesArray = [...tablesArray, updatedTable];

        //Creating a new array of all the reservations in the dashboard state that aren't being edited.
        const reservationsArray = reservations.filter(
          (reservation) => reservation.reservation_id !== reservation_id
        );

        //Creating a new array with only the reservation that is being changed.
        const tableReservation = reservations.filter(
          (reservation) => reservation.reservation_id === reservation_id
        );

        //Updating the status of the reservation that's being edited.
        const updatedReservation = {
          ...tableReservation[0],
          status: "finished",
        };

        //Creating a new array of all non-edited reservations, as well as the edited reservation, to use for changing dashboard reservations state.
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
