export interface Brand {
    id: string;
    name: string;
    logo?: string | null;
}

export interface Model {
    id: string;
    name: string;
    brandId: string;
}

export interface Generation {
    id: string;
    name: string;
    modelId: string;
    year_from: number;
    year_to: number;
    photo?: string | null;
}

export interface CarFormData {
    // Основная информация
    brand: string;
    model: string;
    generation: string;
    
    // Фары
    headlight_types: string[];
    headlights_description: string;
    
    // Рамки
    frames_specs: string;
    frames_issues: string;
    
    // Обманки
    emulators_specs: string;
    emulators_issues: string;
    
    // Крепления
    mounts_specs: string;
    mounts_issues: string;
    
    // Стёкла
    glass_specs: string;
    glass_issues: string;
    
    // Дополнительная информация
    additional_info: string;
    additional_issues: string;
}

export interface CarInfo {
    id: string;
    generationId: string;
    headlights: string[];
    frames: string[];
    emulators: string[];
    mounts: string[];
    glass: string[];
    additionalInfo: string[];
} 