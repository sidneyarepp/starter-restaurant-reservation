/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const requiredProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const validProperties = [
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "created_at",
  "updated_at",
];

//Check to make sure the request body has a data key.
function hasData(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "data from the request body is missing.",
    });
  }
  next();
}

//When editing a current reservation the reservationExists function makes sure the reservation exists in the database.
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const [reservation] = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ID ${reservation_id} does not exist.`,
  });
}

//When an individual reservation needs to be pulled the read function pulls the information for the reservation.
function read(req, res) {
  const reservation = res.locals.reservation;
  res.status(200).json({ data: reservation });
}

//Verifies that all required properties are included in the request body.
function hasRequiredProperties(req, res, next) {
  const requestProperties = Object.keys(req.body.data);
  const missingProperties = requiredProperties.filter(
    (property) => !requestProperties.includes(property)
  );

  if (missingProperties.length) {
    return next({
      status: 400,
      message: `${missingProperties} is required.`,
    });
  }
  next();
}

//Verifies that all properties in the request body are valid properties.
function allPropertiesValid(req, res, next) {
  const invalidProperties = Object.keys(req.body.data).filter(
    (property) => !validProperties.includes(property)
  );
  if (invalidProperties.length) {
    return next({
      status: 400,
      message: `Invalid properties included: ${invalidProperties.join(", ")}.`,
    });
  }
  next();
}

//Verifies there is a first_name key in the request body and that it's not blank.
function hasFirstName(req, res, next) {
  const first_name = req.body.data.first_name;
  if (first_name && first_name !== "") {
    res.locals.first_name = first_name;
    return next();
  }
  next({
    status: 400,
    message: "Property first_name must be included.",
  });
}

//Verifies there is a last_name key in the request body and that it's not blank.
function hasLastName(req, res, next) {
  const last_name = req.body.data.last_name;
  if (last_name && last_name !== "") {
    res.locals.last_name = last_name;
    return next();
  }
  next({
    status: 400,
    message: "Property last_name must be included.",
  });
}

//Verifies there is a mobile_number key in the request body and it isn't blank.
function hasMobileNumber(req, res, next) {
  const mobile_number = req.body.data.mobile_number;
  if (mobile_number && mobile_number !== "") {
    res.locals.mobile_number = mobile_number;
    return next();
  }
  next({
    status: 400,
    message: "Property mobile_number must be included.",
  });
}

//Verifies there is a reservation_date key in the request body and that it isn't blank.
function hasReservationDate(req, res, next) {
  const reservation_date = req.body.data.reservation_date;
  if (reservation_date && reservation_date !== "") {
    res.locals.reservation_date = reservation_date;
    return next();
  }
  next({
    status: 400,
    message: "Property reservation_date must be included.",
  });
}

//Verifies that the reservation_date value is a proper date.
function reservationDateIsADate(req, res, next) {
  const dateCheck = new Date(res.locals.reservation_date).toString();
  if (dateCheck === "Invalid Date") {
    next({
      status: 400,
      message: "Property reservation_date must be a date.",
    });
  }
  next();
}

//Verifies that the request body has a reservation_time key and that it isn't blank.
function hasReservationTime(req, res, next) {
  const reservation_time = req.body.data.reservation_time;
  if (reservation_time && reservation_time !== "") {
    res.locals.reservation_time = reservation_time;
    return next();
  }
  next({
    status: 400,
    message: "Property reservation_time must be included.",
  });
}

//Verifies that the reservation_time value is a time and in the expected format.
function reservationTimeIsATime(req, res, next) {
  const reservation_time = res.locals.reservation_time;
  if (!reservation_time.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
    return next({
      status: 400,
      message: "reservation_time value is not a valid time.",
    });
  }
  next();
}

//Takes the reservation day and time in the request body and turns it into an epoch time so it can be compared.
//Verifies that the date in the request body isn't a Tuesday since the restaurant is closed on Tuesday.
//Verifies that the date and time in the request body is not in the past.
//verifies that the date and time in the request body is not before 10:30am (opening time) or after 9:30pm (an hour before the restaurant closes).
function reservationDateAndTimeInFuture(req, res, next) {
  const reservation_date = res.locals.reservation_date;
  const reservation_time = res.locals.reservation_time;

  //Breaking the reservation_date and reservation_time down to it's individual parts for time conversion to epoch time.
  const reservationDateArray = reservation_date.split("-");
  const reservationTimeArray = reservation_time.split(":");
  const year = Number(reservationDateArray[0]);
  const month = Number(reservationDateArray[1] - 1);
  const day = Number(reservationDateArray[2]);
  const hour = Number(reservationTimeArray[0]);
  const minute = Number(reservationTimeArray[1]);

  //Converting the reservation_date from the request body into a standardized date.
  const reservationDate = new Date(year, month, day);

  //Converting the reservation date and time into epoch time.
  const reservationDateTime = new Date(
    year,
    month,
    day,
    hour,
    minute
  ).getTime();

  const dayOfWeek = reservationDate.getDay();

  //Gets the timezone offset of the client in minutes and converts it to milliseconds.
  const timezoneOffset = Number(req.body.data.timezoneOffset);

  //Checking the difference between the current time and the reservation time to verify the reservation isn't in the past.  Both are in UTC time, so both need to subtract the offset that was calculated.
  const timeDifference = reservationDateTime + timezoneOffset - new Date() < 0;

  if (dayOfWeek === 2) {
    next({
      status: 400,
      message: `The restaurant is closed on Tuesday.`,
    });
  }
  if (reservation_time <= "10:30:00") {
    return next({
      status: 400,
      message: `Reservations must be set between 10:30 AM and 9:30 PM.`,
    });
  }
  if (reservation_time > "21:29:59") {
    return next({
      status: 400,
      message: `Reservations must be set for 9:30 PM or earlier.`,
    });
  }
  if (timeDifference) {
    return next({
      status: 400,
      message: `The reservation must be for a day and time in the future. New Date: ${new Date()}, Reservation Date: ${new Date(
        reservationDateTime
      )}, Reservation Date + Timezone Offset: ${new Date(
        reservationDateTime + timezoneOffset
      )}, Time Difference: ${
        reservationDateTime + timezoneOffset - new Date()
      }`,
    });
  }
  next();
}

//Verifies that the request body has a people key and is not blank.
function hasPeople(req, res, next) {
  const people = req.body.data.people;
  if (people && people !== "") {
    res.locals.people = people;
    return next();
  }
  next({
    status: 400,
    message: "Property people must be included.",
  });
}

//Verifies that the people field is a number (the number of peple in the party).
function peopleIsNotNaN(req, res, next) {
  if (typeof res.locals.people !== "number") {
    return next({
      status: 400,
      message: "Property people must be a number.",
    });
  }
  next();
}

//Verifies that the value of people is greater than 0.  This is a requirement in the form, but this verifies a request sent manually doesn't break this rule.
function peopleGreaterThanZero(req, res, next) {
  if (!res.locals.people > 0) {
    return next({
      status: 400,
      message: "Property people must be greater than zero.",
    });
  }
  next();
}

//Verifies that a table being created is not automatically given a status of seated or finished.  The default is booked, but this is to make sure someone doesn't manually load a reservation with an incorrect status.
function correctTableCreationStatus(req, res, next) {
  const status = req.body.data.status;
  if (status === "finished" || status === "seated") {
    return next({
      status: 400,
      message:
        "A reservation cannot be created with a status of seated or finished.",
    });
  }
  next();
}

//Prevents a user from editing a table that has a status of finished.
function correctTableUpdateStatus(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: "A finished reservation cannot be updated.",
    });
  }
  next();
}

//Verifies that the request body status is one of the four valid statuses: booked, seated, finished, or cancelled.
function hasValidStatusRequest(req, res, next) {
  const { status } = req.body.data;
  if (
    status == "booked" ||
    status === "seated" ||
    status === "finished" ||
    status === "cancelled"
  ) {
    return next();
  }
  next({
    status: 400,
    message: `The reservation status ${status} is invalid.`,
  });
}

//Lists all reservations found in the database.
async function list(req, res) {
  if (req.query.mobile_number) {
    const response = await service.search(req.query.mobile_number);
    return res.status(200).json({ data: response });
  }
  if (!req.query.date) {
    return res.status(200).json({ data: await service.list() });
  }
  res.status(200).json({ data: await service.listByDate(req.query.date) });
}

//Used to create a new reservation.
async function create(req, res) {
  const reservation = { ...req.body.data, status: "booked" };
  const response = await service.create(reservation);
  res.status(201).json({ data: response });
}

//Used to update a reservation
async function update(req, res) {
  const reservationId = res.locals.reservation.reservation_id;
  const changedReservation = req.body.data;
  const updatedReservation = await service.update(
    reservationId,
    changedReservation
  );
  res.status(200).json({ data: updatedReservation });
}

//Used to update the status of a reservation.  This is primarily used when a reservation is seated or a table is finished.
async function updateReservationStatus(req, res) {
  const updatedReservation = { ...res.locals.reservation, ...req.body.data };
  const response = await service.updateReservationStatus(updatedReservation);
  res.status(200).json({ data: response });
}

module.exports = {
  read: [asyncErrorBoundary(reservationExists), read],
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasRequiredProperties,
    allPropertiesValid,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    reservationDateIsADate,
    hasReservationTime,
    reservationTimeIsATime,
    reservationDateAndTimeInFuture,
    hasPeople,
    peopleGreaterThanZero,
    peopleIsNotNaN,
    correctTableCreationStatus,
    asyncErrorBoundary(create),
  ],
  update: [
    hasData,
    reservationExists,
    hasRequiredProperties,
    allPropertiesValid,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    reservationDateIsADate,
    hasReservationTime,
    reservationTimeIsATime,
    reservationDateAndTimeInFuture,
    hasPeople,
    peopleGreaterThanZero,
    peopleIsNotNaN,
    correctTableUpdateStatus,
    hasData,
    hasRequiredProperties,
    allPropertiesValid,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    hasReservationTime,
    reservationTimeIsATime,
    reservationDateAndTimeInFuture,
    hasPeople,
    peopleGreaterThanZero,
    peopleIsNotNaN,
    correctTableUpdateStatus,
    asyncErrorBoundary(update),
  ],
  updateReservationStatus: [
    hasData,
    reservationExists,
    correctTableUpdateStatus,
    hasValidStatusRequest,
    asyncErrorBoundary(updateReservationStatus),
  ],
};
