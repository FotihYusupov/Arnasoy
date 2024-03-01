const { Router } = require('express');
const currencyController = require('../controllers/currencyController')

const currencyRoutes = Router()

currencyRoutes.get('/currency', currencyController.getAll);
currencyRoutes.get('/currency/:date', currencyController.getByDate);

module.exports = currencyRoutes;