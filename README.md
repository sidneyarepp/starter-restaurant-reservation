# Periodic Tables Restaurant Reservation App

### The periodic tables restaurant reservation app is meant to be used to a restaurant for the following purposes:

- Create reservations
- Edit reservations
- Cancel reservations
- Track each reservation's status
- Inventory tables and their maximum capacities
- Track each table's status as reservations are seated and finished
- Search for scheduled reservations

All of these functions are completed through the various pages in the site:

- Dashboard
- New Reservation
- New Table
- Search

---

### Dashboard

![dashboard](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/1_homepage.png)

####The dashboard contains several sections:

- Previous Day, Current Day, and Next Day buttons
- List of reservations based on the date provided in the URL
- List of tables in the restaurant

#### Previous Day, Current Day, and Next Day Buttons

The "Previous Day", "Current Day", and "Next Day" buttons are all used to navigate dates and see reservations for those days.

##### Previous Day

The "Previous Day" button will navigate backwards one day for each time it is clicked.

##### Current Day

The "Current Day" button will navigate to the current day based on the user's computer.

##### Next Day

The "Next Day" button will navigate forward in time one day for each time it is clicked.

#### Reservations Section

The "Reservations" section of the Dashboard shows all of the reservations, as well as their information, scheduled for the date provided in the URL.

#### Tables Section

The "Tables" section of the Dashboard shows an inventory and information about all the tables at the restaurant.

---

### New Reservation Page

![new reservation page](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/5_new_reservation_page.png)

The new reservation page allows a user to create a new reservation with the following information, all required:

- First Name
- Last Name
- Phone Number (Not required to be in a particular format)
- Reservation Date (Autoformatted)
- Reservation Time (Autoformatted)
- Number of People In the Party (Required to be a number greater than 1)

Server Side Logic Checks:

- The reservation includes only valid properties
- The reservation includes all required properties
- All required properties are not blank
- The reservation date is a date
- The reservation time is a time
- The reservation time is between 10:30am and 9:30pm based on the user's timezone
- The reservation date and time are not in the past based on the user's timezone
- The reservation is not on a Tuesday (restaurant closed on Tuesdays)
- The number of people in the party is a number and greater than 0
- The default status for a reservation being created is "booked", but checks are done to make sure a reservation is not created with a status of "seated" or "finished"

Clicking "Submit" will create the reservation in the database and take the user back to the dashboard. The dashboard date will be the date the user entered for the reservation date on the new reservation page.

**_If the user clicks the cancel button they will be taken back to the dashboard with no new reservation created._**

---

### Dashboard - With Reservation Created

After a reservation has been created it will appear on the dashboard under the reservations section. The URL will have to include the date of the reservation as a query string, ?date=[date of reservation]}.

![new reservation page](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/8_created_reservation.png)

**_Reservations with a status of booked can be seated, edited or cancelled._**

#### Cancel Reservation Button

When a user clicks the cancel button of the reservation a confirmation prompt will pop up. The user will have two options:

![cancel reservation button clicked](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/11_dashboard_cancel_button_clicked.png)

- The user can click the "Cancel" button and the prompt will go away. No changes will be made to the reservation.
- The user can click the "OK" button and the reservation's status will change to cancelled and be removed from the dashboard. **_The reservation will not be removed from the database, but the dashboard has logic to not display reservations with a status of cancelled._**

#### Edit Reservation Button

When a user clicks the edit button of the reservation they will be taken to a page that looks like the new reservation page. All of the logic for the reservations is the same when editing reservations as it is when creating them. The only additional logic checks that take place when editing a reservation are:

![edit reservation button clicked](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/15_edit_button_clicked.png)

- A check is made to verify that a reservation exists in the database with the reservation id provided
- The status of the reservation is checked because reservations with a status of "seated", "finished", or "cancelled" cannot be edited.

Clicking "Submit" will edit the reservation in the database and take the user back to the dashboard. The dashboard date will be the date the user entered for the reservation date on the edit reservation page.

**_If the user clicks the cancel button they will be taken back to the dashboard with no new reservation created._**

#### Seat Reservation Button

When a reservation party is ready to be seated the user can click the "Seat" button. This will take them to the seat reservation page.

![seat reservation button clicked](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/18_seat_button_clicked.png)

On this page the user can select a table from the dropdown. Each table has the name of the table and the maximum capacity that can be seated at it.

![table select options](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/19_select_table_dropdown.png)

Server Side Logic Checks:

- The table exists based on the table id sent to the server
- The table status is checked to make sure it is "free"
- The table capacity is checked to verify it can handle the reservation size
- The reservation exists based on the reservation id sent to the server
- The reservation status is not "seated", "cancelled", or "finished"

Clicking "Submit" will edit the reservation to change the status to "seated", as well as change the table status to "occupied". Once a reservation status is listed as "seated" the "cancel", "edit", and "seat" buttons all go away. Reservations with a status of "seated" cannot be cancelled, edited, or seated.

**_If the user clicks the cancel button they will be taken back to the dashboard and the reservation will not be seated._**

---

### Finishing a Seated Reservation

When a reservation has completed their meal, and their table is ready to seat a new guest, the user can click the "Finish" button next to the table the reservation is seated at.

Clicking the "Finish" button will set a reservation's will provide the user with a prompt asking, "Is this table ready to seat new guests? This cannot be undone."

Clicking "OK" will change the status of the reservation seated at the table to "finished", and the table the reservation was seated at to a status of "free". The dashboard does not display reservations in a status of "cancelled" or "finished", and choosing to finish a table will remove the reservation from the dashboard.

Finish Button Clicked:
![table select options](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/23_finish_button_clicked.png)

"OK" on the promp clicked:
![table select options](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/25_finish_button_clicked.png)

**_If the user clicks the cancel button they will be taken back to the dashboard. The table for the reservation will not be set to "free", and the reservation will remain in a status of "seated"._**

---

### New Table Page

![new table page](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/15_edit_button_clicked.png)

There are only two fields that have to be filled out to create a new table:

- Table Name
- Capacity

Server Side Logic Checks:

- Table name is included
- Table name is at least two characters
- Table capacity is included
- Table capacity is a number

Clicking "Submit" will create the new table and take the user back to the dashboard. The new table will appear in the "Tables" section of the dashboard.

![new table created](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/30_new_table_created.png)

**_If the user clicks the cancel button they will be taken back to the dashboard and the table will not be created._**

---

### Search Page

The search page allows a user to search for all existing reservations based on phone number. The phone number can be searched based on a partial or complete number. If any reservations are found with a matching phone number they will appear and offer the same options a user would see on the dashboard.

![search page](https://github.com/sidneyarepp/starter-restaurant-reservation/blob/main/Markdown_Screenshots/22_reservation_search.png)

---

## API Documentation

### **Endpoints for Reservations**

| API path                               | Method(s)                                                                                                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/reservations`                        | **GET**: List all reservations.<br/> **POST**: Create a new reservation.                                                                                                   |
| `/reservations/?date='YYYY-MM-DD'`     | **GET**: List all reservations by date.                                                                                                                                    |
| `/reservations/:reservation_id`        | **GET**: Read a single reservation by 'reservation_id'.<br/> **PUT**: Update a reservation by 'reservation_id'.<br/> **DELETE**: Delete a reservation by 'reservation_id'. |
| `/reservations/:reservation_id/status` | **PUT**: Update a reservation's status. Options being "booked", "seated", or "finished".                                                                                   |

### **Endpoints for Tables**

| API path                 | Method(s)                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `/tables`                | **GET**: List all tables.<br/> **POST**: Create a new table.                                        |
| `/tables/:table_id`      | **GET**: Read a single table by 'table_id'.<br/> **DELETE**: Delete a table by 'table_id'.          |
| `/tables/:table_id/seat` | **PUT**: Update a table's status to "occupied".<br/> **DELETE**: Update a table's status to "free". |

---

## Project Stack

Front-end:

- HTML
- CSS
- Bootstrap
- JavaScript
- React

Back-end:

- Express
- JavaScript
- Node.js
- Knex

Database:

- PostgreSQL

Production Site Through Vercel
