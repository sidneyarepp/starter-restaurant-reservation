const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

const validKeys = [
    'table_name',
    'capacity',
    'table_id',
    'created_at',
    'updated_at',
    'table_availability',
    'assigned_reservation_id'
]

const requiredKeys = [
    'table_name',
    'capacity'
]

function tableValidationCheck(req, res, next) {
    const request = req.body.table;
    const tableCapacity = req.body.table.capacity;
    const tableAvailability = req.body.table.table_availability;
    const partySize = req.body.reservation.people;
    const requestKeys = Object.keys(request);
    const requiredKeysIncluded = requiredKeys.filter(key => !requiredKeys.includes(key));
    console.log(requiredKeysIncluded)
    const incorrectKeysIncluded = validKeys.filter(key => !requestKeys.includes(key));
    const errors = [];

    if (requiredKeysIncluded.length) {
        errors.push(`Properties table_name and capacity are required.`)
    }
    if (incorrectKeysIncluded.length) {
        errors.push(`Incorrect properties included: ${incorrectKeysIncluded.join(', ')}.`)
    }
    if (partySize > tableCapacity) {
        errors.push(`Please select a table with a capacity that can handle ${partySize} people.`)
    }
    if (tableAvailability === 'occupied') {
        errors.push('This table is currently occupied. Please select a table that is available.')
    }
    if (errors.length) {
        return next({
            status: 400,
            message: errors.join(' ')
        })
    }
    return next();
}

function reservationValidationCheck(req, res, next) {
    const { reservation_id } = req.body.reservation;
    cnosole.log(req.body.reservation)

    if (!reservation_id) {
        errors.push('Reservation ID property is required.')
    }
    if (reservation_id === '') {
        errors.push('Reservation ID data is required.')
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
    res.json(data);
}

async function create(req, res) {
    let table = req.body;
    await service.create(table);
    res.sendStatus(201);
}

async function seatReservation(req, res) {
    const tableId = req.body.table.table_id;
    const reservationId = req.body.reservation.reservation_id;
    await service.setSeatReservation(tableId, reservationId);
    res.sendStatus(200);
}

async function clearReservation(req, res) {
    await service.clearTable(req.params.table_id);
    res.sendStatus(200);
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [tableValidationCheck, asyncErrorBoundary(create)],
    seatReservation: [tableValidationCheck, reservationValidationCheck, asyncErrorBoundary(seatReservation)],
    clearReservation: asyncErrorBoundary(clearReservation)
}