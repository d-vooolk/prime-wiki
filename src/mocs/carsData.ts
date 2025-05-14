import { Brand, Model, Generation, CarInfo } from '../types/car.types';

export const brands: Brand[] = [
    { id: '1', name: 'BMW' },
    { id: '2', name: 'Mercedes-Benz' },
    { id: '3', name: 'Audi' }
];

export const models: Model[] = [
    { id: '1', name: '3 Series', brandId: '1' },
    { id: '2', name: '5 Series', brandId: '1' },
    { id: '3', name: 'C-Class', brandId: '2' },
    { id: '4', name: 'E-Class', brandId: '2' },
    { id: '5', name: 'A4', brandId: '3' },
    { id: '6', name: 'A6', brandId: '3' }
];

export const generations: Generation[] = [
    { id: '1', name: 'G20', modelId: '1', yearFrom: '2018', yearTo: '2023' },
    { id: '2', name: 'G30', modelId: '2', yearFrom: '2016', yearTo: '2023' },
    { id: '3', name: 'W205', modelId: '3', yearFrom: '2014', yearTo: '2021' },
    { id: '4', name: 'W213', modelId: '4', yearFrom: '2016', yearTo: '2023' },
    { id: '5', name: 'B9', modelId: '5', yearFrom: '2015', yearTo: '2023' },
    { id: '6', name: 'C8', modelId: '6', yearFrom: '2018', yearTo: '2023' }
];

export const carInfo: CarInfo = {
    id: '1',
    generationId: '1',
    headlights: 'LED фары с адаптивным освещением',
    frames: 'Хромированные рамки фар',
    emulators: 'Эмуляторы для LED фар',
    mounts: 'Стандартные крепления',
    glass: 'Закаленное стекло',
    additionalInfo: 'Дополнительная информация о комплектации'
};