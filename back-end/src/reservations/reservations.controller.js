/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

function validationCheck(req, res, next) {
  const data = req.body;
  const requestKeys = Object.keys(data);
  const invalidProperties = requestKeys.filter(property => !validProperties.includes(property));
  const hasAllProperties = validProperties.filter(property => requestKeys.includes(property));
  const dayOfWeek = new Date(data.reservation_date).getDay();
  const todayDate = new Date();
  const reservationDate = new Date(`${data.reservation_date} ${data.reservation_time}`);
  const timeDifference = reservationDate.getTime() - todayDate.getTime();
  const errors = [];

  if (dayOfWeek === 1) {
    errors.push('The restaurant is closed on Tuesday.')
  }
  if (timeDifference < 0) {
    errors.push('The reservation must be for a day and time in the future.')
  }
  if (data.reservation_time < '10:30:00') {
    errors.push(`Reservations must be set between 10:30 AM and 9:30 PM.`)
  }
  if (data.reservation_time > '21:29:59') {
    errors.push(`Reservations must be set for 9:30 PM or earlier.`)
  }
  if (hasAllProperties.length < 6) {
    errors.push(`All valid properties must be included: ${validProperties.join(', ')}.`)
  }
  if (invalidProperties.length) {
    errors.push(`Invalid Properties: ${invalidProperties.join(', ')}.`)
  }

  if (errors.length) {
    return next({
      status: 400,
      message: errors.join(' ')
    })
  } else {
    next();
  }
}

async function list(req, res) {
  if (req.query.mobile_phone) {
    const response = await service.search(req.query.mobile_phone)
    return res.json({ data: response })
  }
  if (!req.query.date) {
    return res.json({ data: await service.list() })
  }
  res.json({ data: await service.listByDate(req.query.date) });
}

async function create(req, res) {
  let reservation = req.body;
  await service.create(reservation);
  res.sendStatus(201);
}

async function update(req, res) {
  let reservationId = req.body.data.reservation_id;
  let statusChange = req.body.data.status;
  await service.update(reservationId, statusChange);
  res.sendStatus(200);
}

async function updateReservation(req, res) {
  console.log(req.body)
  const reservationId = req.body.reservation_id;
  let updatedReservation = req.body;
  await service.updateReservation(reservationId, updatedReservation);
  res.sendStatus(200);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validationCheck, asyncErrorBoundary(create)],
  update: asyncErrorBoundary(update),
  updateReservation: asyncErrorBoundary(updateReservation),
};
