import { API_CONFIG } from '../config/api.config';
import { Brand, Model, Generation, CarInfo, CarFormData } from '../types/car.types';

const headers = {
    'api-token': API_CONFIG.TOKEN
};

export const carApi = {
    async fetchBrands(): Promise<Brand[]> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/marks`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch brands');
        }
        const data = await response.json();
        const brandsData = Array.isArray(data) ? data : data.data || [];
        return brandsData.map((brand: Brand) => ({
            ...brand,
            logo: brand.logo ? `${API_CONFIG.IMAGE_BASE_URL}${brand.logo}` : null
        }));
    },

    async fetchModels(markId: string): Promise<Model[]> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/marks/${markId}/models`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : data.data || [];
    },

    async fetchGenerations(markId: string, modelId: string): Promise<Generation[]> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/marks/${markId}/models/${modelId}/generations`,
            { headers }
        );
        if (!response.ok) {
            throw new Error('Failed to fetch generations');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : data.data || [];
    },

    async fetchCarInfo(generationId: string): Promise<CarInfo> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/generations/${generationId}/info`, {
            headers: {
                'Authorization': `Bearer ${API_CONFIG.TOKEN}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch car info');
        }
        return response.json();
    },

    async addCarInfo(data: CarFormData): Promise<void> {
        const response = await fetch(`${API_CONFIG.BASE_URL}/car-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.TOKEN}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Failed to add car info');
        }
    }
}; 