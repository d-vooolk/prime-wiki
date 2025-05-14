import React from 'react';
import { Breadcrumb } from 'antd';
import { Brand, Model, Generation } from '../../types/car.types';

interface CustomBreadcrumbProps {
    selectedBrand: string | null;
    selectedModel: string | null;
    selectedGeneration: string | null;
    brands: Brand[];
    models: Model[];
    generations: Generation[];
}

const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({
    selectedBrand,
    selectedModel,
    selectedGeneration,
    brands,
    models,
    generations
}) => {
    const selectedBrandData = brands.find(brand => brand.id === selectedBrand);
    const selectedModelData = models.find(model => model.id === selectedModel);
    const selectedGenerationData = generations.find(generation => generation.id === selectedGeneration);

    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Главная</Breadcrumb.Item>
            {selectedBrandData && (
                <Breadcrumb.Item>{selectedBrandData.name}</Breadcrumb.Item>
            )}
            {selectedModelData && (
                <Breadcrumb.Item>{selectedModelData.name}</Breadcrumb.Item>
            )}
            {selectedGenerationData && (
                <Breadcrumb.Item>{selectedGenerationData.name}</Breadcrumb.Item>
            )}
        </Breadcrumb>
    );
};

export default CustomBreadcrumb; 