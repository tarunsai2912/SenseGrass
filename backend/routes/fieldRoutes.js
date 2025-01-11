const authMiddleware = require("../middleware/authMiddleware")
const express = require('express')
const router = express.Router()
const fieldController = require('../controllers/fieldController')

router.post('/create', authMiddleware, fieldController.createField)
router.get('/user', authMiddleware, fieldController.getUserFields)
router.get('/other', authMiddleware, fieldController.getOtherFields)
router.put('/update/:id', authMiddleware, fieldController.updateField)
router.delete('/delete/:id', authMiddleware, fieldController.deleteField)

module.exports = router
