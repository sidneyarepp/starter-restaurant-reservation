/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

async function list(req, res) {
  const data = await service.list();
  res.json({ data: data });
}

async function listByDate(req, res) {
  const date = req.query.date;
  console.log(date)
  const data = await service.listByDate(date);
  res.json({ data: data })
}

module.exports = {
  list,
  listByDate,
};
