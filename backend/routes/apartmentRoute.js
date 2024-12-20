const express = require('express');
const { addApartment, getApartments, updateApartment, deleteApartment } = require('../controllers/apartmentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
//const { roleMiddleware } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/register', addApartment);
router.get('/',  getApartments);
router.put('/:id', updateApartment);
router.delete('/:id', deleteApartment);

module.exports = router;
