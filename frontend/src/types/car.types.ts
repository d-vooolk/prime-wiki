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

export interface MediaFile {
    filename: string;
    originalname: string;
    path: string;
    size: number;
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
    id: string,
    brand: string,
    model: string,
    generation: number | string,
    description?: string,
    frames?: string,
    emulators?: string,
    photos?: MediaFile[],
    videos?: MediaFile[],
    createdAt?: string,
    updatedAt?: string
} 