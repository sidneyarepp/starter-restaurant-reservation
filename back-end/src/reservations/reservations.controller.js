/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

function validPropertiesCheck(req, res, next) {
  const { data = {} } = req.body;
  const invalidProperties = Object.keys(data).filter(key => !validProperties.includes(key));


  if (invalidProperties.length) {
    return next({
      status: 400,
      message: `Invalid Properties: ${invalidProperties.join(', ')}.`
    })
  }
  // } else if (Object.keys(data).length < 6) {
  //   return next({
  //     status: 400,
  //     message: `All valid properties must be included: ${validProperties.join(', ')}.`
  //   })
  // } else {
  next();
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
  try {
    let reservation = req.body;
    await service.create(reservation);
    res.status(201);
  }
  catch (error) {
    console.log(error);
  }
}

module.exports = {
  list,
  listByDate,
  create: [validPropertiesCheck, create],
};
