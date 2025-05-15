import express from 'express';
import {
    getCarInfo,
    createCarInfo,
    updateCarInfo,
    deleteCarInfo
} from '../controllers/carInfoController';

const router = express.Router();

router.get('/', getCarInfo);
router.post('/', createCarInfo);
router.put('/:id', updateCarInfo);
router.delete('/:id', deleteCarInfo);

export default router; 