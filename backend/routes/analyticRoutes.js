const express = require('express')
const router = express.Router()
const analyticController = require('../controllers/analyticController')

router.post('/analyze', analyticController.showAnalytics)

module.exports = router
