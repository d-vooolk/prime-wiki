import {CarInfo, Generation} from "../../types/car.types";

export interface TabsContentProps {
    carInfo?: CarInfo | null;
    generations: Generation[];
    selectedBrand: string | null;
    selectedModel: string | null;
    selectedGeneration: string | null;
}

export interface SendObjectInterface {
    brand: string | null;
    model: string | null;
    generation: string | null;
    description?: string;
    frames?: string;
    emulators?: string;
    photos?: any[];
    videos?: any[];
}