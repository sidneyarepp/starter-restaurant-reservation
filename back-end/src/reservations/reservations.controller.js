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
  const data = await service.list();
  res.json({ data: data });
}

async function listByDate(req, res) {
  const date = req.query.date;
  const data = await service.listByDate(date);
  res.json({ data: data })
}

async function create(req, res) {
  let reservation = req.body;
  await service.create(reservation);
  res.sendStatus(201);
}

module.exports = {
  list: asyncErrorBoundary(list),
  listByDate: asyncErrorBoundary(listByDate),
  create: [validationCheck, asyncErrorBoundary(create)],
};
