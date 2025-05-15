import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { CarInfo } from '../entities/CarInfo';

const carInfoRepository = AppDataSource.getRepository(CarInfo);

export const getCarInfo = async (req: Request, res: Response) => {
    try {
        const carInfo = await carInfoRepository.find();
        res.json(carInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching car info', error });
    }
};

export const createCarInfo = async (req: Request, res: Response) => {
    try {
        const carInfo = carInfoRepository.create(req.body);
        const result = await carInfoRepository.save(carInfo);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Error creating car info', error });
    }
};

export const updateCarInfo = async (req: Request, res: Response) => {
    try {
        const carInfo = await carInfoRepository.findOne({ where: { id: req.params.id } });
        if (!carInfo) {
            return res.status(404).json({ message: 'Car info not found' });
        }
        carInfoRepository.merge(carInfo, req.body);
        const result = await carInfoRepository.save(carInfo);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: 'Error updating car info', error });
    }
};

export const deleteCarInfo = async (req: Request, res: Response) => {
    try {
        const carInfo = await carInfoRepository.findOne({ where: { id: req.params.id } });
        if (!carInfo) {
            return res.status(404).json({ message: 'Car info not found' });
        }
        await carInfoRepository.remove(carInfo);
        res.json({ message: 'Car info deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting car info', error });
    }
}; 