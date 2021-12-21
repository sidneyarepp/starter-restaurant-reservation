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

function hasData(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "data from the request body is missing.",
    });
  }
  next();
}

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

function read(req, res) {
  const reservation = res.locals.reservation;
  res.status(200).json({ data: reservation });
}

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

function reservationDateAndTimeInFuture(req, res, next) {
  const reservation_date = res.locals.reservation_date;
  const reservation_time = res.locals.reservation_time;
  const reservationDate = Date.parse(
    `${reservation_date} ${reservation_time} EST`
  );
  const dayOfWeek = new Date(reservationDate).getDay();
  const currentTime = Date.now();
  const timeDifference = reservationDate < currentTime;

  if (dayOfWeek === 2) {
    next({
      status: 400,
      message: "The restaurant is closed on Tuesday.",
    });
  }
  if (timeDifference) {
    return next({
      status: 400,
      message: "The reservation must be for a day and time in the future.",
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
  next();
}

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

function peopleIsNotNaN(req, res, next) {
  if (typeof res.locals.people !== "number") {
    return next({
      status: 400,
      message: "Property people must be a number.",
    });
  }
  next();
}

function peopleGreaterThanZero(req, res, next) {
  if (!res.locals.people > 0) {
    return next({
      status: 400,
      message: "Property people must be greater than zero.",
    });
  }
  next();
}

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

async function create(req, res) {
  const reservation = { ...req.body.data, status: "booked" };
  const response = await service.create(reservation);
  res.status(201).json({ data: response });
}

async function update(req, res) {
  const reservationId = res.locals.reservation.reservation_id;
  const changedReservation = req.body.data;
  const updatedReservation = await service.update(
    reservationId,
    changedReservation
  );
  res.status(200).json({ data: updatedReservation });
}

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
    reservationDateIsADate,
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
