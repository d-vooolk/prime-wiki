export interface Brand {
    id: string;
    name: string;
    logo?: string;
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
    yearFrom: string;
    yearTo: string;
}

export interface CarSpecs {
    engine: string;
    power: string;
    transmission: string;
    drive: string;
    fuelEconomy: string;
    dimensions: string;
}

export interface CarRatings {
    reliability: number;
    comfort: number;
    performance: number;
}

export interface CarInfo {
    id: string;
    generationId: string;
    headlights: string;
    frames: string;
    emulators: string;
    mounts: string;
    glass: string;
    additionalInfo: string;
}

export type CarData = Record<string, CarInfo>;