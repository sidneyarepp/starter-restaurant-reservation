const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

const correctKeys = [
    'table_name',
    'capacity'
]

function propertyCheck(req, res, next) {
    const request = req.body;
    const requestKeys = Object.keys(request);
    const requiredKeysIncluded = requestKeys.filter(key => !correctKeys.includes(key));
    const incorrectKeysIncluded = correctKeys.filter(key => !requestKeys.includes(key));
    const errors = [];

    if (requiredKeysIncluded.length) {
        errors.push(`Properties table_name and capacity are required.`)
    }
    if (incorrectKeysIncluded.length) {
        errors.push(`Incorrect properties included: ${incorrectKeysIncluded.join(', ')}.`)
    }
    if (errors.length) {
        return next({
            status: 400,
            message: errors.join(' ')
        })
    }
    return next();
}

function tableReservationValidation(req, res, next) {
    const { table_id, capacity, table_availability } = req.body.table;
    const { reservation_id, people } = req.body.reservation;
    const errors = [];

    if (capacity < people) {
        errors.push(`Please select a table with a capacity of ${people} people or more!`)
    }
    if (table_availability === 'occupied') {
        errors.push(`Please select a table that is currently available!`)
    }
    if (errors.length) {
        return next({
            status: 400,
            message: errors.join(' ')
        })
    }
    res.locals.tableId = table_id;
    res.locals.reservationId = reservation_id;
    return next()
}

async function list(req, res) {
    const data = await service.list();
    res.json(data);
}

async function create(req, res) {
    let table = req.body;
    await service.create(table);
    res.sendStatus(201);
}

async function seatReservation(req, res) {
    const tableId = res.locals.tableId
    const reservationId = res.locals.reservationId
    await service.setSeatReservation(tableId, reservationId);
    res.sendStatus(201);
}

async function clearReservation(req, res) {
    await service.clearTable(req.params.table_id);
    res.sendStatus(200);
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [propertyCheck, asyncErrorBoundary(create)],
    seatReservation: [tableReservationValidation, asyncErrorBoundary(seatReservation)],
    clearReservation: asyncErrorBoundary(clearReservation)
}