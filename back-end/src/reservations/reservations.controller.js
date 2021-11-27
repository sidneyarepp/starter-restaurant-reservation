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
      message: "data from request body is missing.",
    });
  }
  next();
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
  const dayOfWeek = new Date(reservation_date).getDay();
  const todayDate = new Date();
  const reservationDate = new Date(`${reservation_date} ${reservation_time}`);
  const timeDifference = reservationDate.getTime() - todayDate.getTime();

  if (dayOfWeek === 1) {
    next({
      status: 400,
      message: "The restaurant is closed on Tuesday.",
    });
  }
  if (timeDifference < 0) {
    return next({
      status: 400,
      message: "The reservation must be for a day and time in the future.",
    });
  }
  if (reservation_time < "10:30:00") {
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

async function list(req, res) {
  if (req.query.mobile_phone) {
    const response = await service.search(req.query.mobile_phone);
    return res.status(200).json({ data: response });
  }
  if (!req.query.date) {
    return res.status(200).json({ data: await service.list() });
  }
  res.status(200).json({ data: await service.listByDate(req.query.date) });
}

async function create(req, res) {
  let reservation = req.body.data;
  res.status(201).json({ data: await service.create(reservation) });
}

async function update(req, res) {
  let reservationId = req.body.data.reservation_id;
  let statusChange = req.body.data.status;
  await service.update(reservationId, statusChange);
  res.sendStatus(200);
}

async function updateReservation(req, res) {
  const reservationId = req.body.data.reservation_id;
  let updatedReservation = req.body.data;
  await service.updateReservation(reservationId, updatedReservation);
  res.sendStatus(200);
}

module.exports = {
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
    asyncErrorBoundary(create),
  ],
  update: asyncErrorBoundary(update),
  updateReservation: asyncErrorBoundary(updateReservation),
};
