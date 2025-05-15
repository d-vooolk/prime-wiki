import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface CarData {
    brand: string;
    model: string;
    generation: string;
    year: number;
}

export const carApi = {
    // Получение списка марок
    getBrands: async () => {
        const response = await axios.get(`${API_URL}/brands`);
        return response.data;
    },

    // Получение списка моделей для выбранной марки
    getModels: async (brand: string) => {
        const response = await axios.get(`${API_URL}/brands/${brand}/models`);
        return response.data;
    },

    // Получение списка поколений для выбранной модели
    getGenerations: async (brand: string, model: string) => {
        const response = await axios.get(`${API_URL}/brands/${brand}/models/${model}/generations`);
        return response.data;
    },

    // Добавление информации об автомобиле
    addCarInfo: async (data: CarData) => {
        const response = await axios.post(`${API_URL}/cars`, data);
        return response.data;
    }
}; 