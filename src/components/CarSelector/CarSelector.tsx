import React, { useEffect, useState } from 'react';
import { Select, Card, Row, Col, message } from 'antd';
import { Brand, Model, Generation } from '../../types/car.types';
import { carApi } from '../../api/car.api';
import { handleApiError } from '../../utils/error.utils';

const { Option } = Select;

interface CarSelectorProps {
    brands: Brand[];
    models: Model[];
    generations: Generation[];
    selectedBrand: string | null;
    selectedModel: string | null;
    selectedGeneration: string | null;
    onBrandChange: (brandId: string) => void;
    onModelChange: (modelId: string) => void;
    onGenerationChange: (generationId: string) => void;
    loading: {
        brands: boolean;
        models: boolean;
        generations: boolean;
    };
}

const CarSelector: React.FC<CarSelectorProps> = ({
    brands,
    models,
    generations,
    selectedBrand,
    selectedModel,
    selectedGeneration,
    onBrandChange,
    onModelChange,
    onGenerationChange,
    loading
}) => {
    useEffect(() => {
        if (selectedBrand) {
            fetchModels(selectedBrand);
        }
    }, [selectedBrand]);

    useEffect(() => {
        if (selectedBrand && selectedModel) {
            fetchGenerations(selectedBrand, selectedModel);
        }
    }, [selectedBrand, selectedModel]);

    const fetchModels = async (markId: string) => {
        try {
            onModelChange(models[0].id);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке моделей');
        }
    };

    const fetchGenerations = async (markId: string, modelId: string) => {
        try {
            onGenerationChange(generations[0].id);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке поколений');
        }
    };

    return (
        <Card title="Выбор автомобиля" bordered={false}>
            <Row gutter={16}>
                <Col span={8}>
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Выберите марку"
                        value={selectedBrand}
                        onChange={onBrandChange}
                        loading={loading.brands}
                        optionFilterProp="label"
                        filterOption={(input, option) => {
                            const brand = brands.find(b => b.id === option?.value);
                            return brand?.name.toLowerCase().includes(input.toLowerCase()) || false;
                        }}
                    >
                        {brands.map(brand => (
                            <Option key={brand.id} value={brand.id} label={brand.name}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {brand.logo && (
                                        <img 
                                            src={brand.logo} 
                                            alt={brand.name} 
                                            style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                                        />
                                    )}
                                    <span>{brand.name}</span>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={8}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Выберите модель"
                        onChange={onModelChange}
                        value={selectedModel}
                        disabled={!selectedBrand}
                        loading={loading.models}
                    >
                        {models.map(model => (
                            <Option key={model.id} value={model.id}>{model.name}</Option>
                        ))}
                    </Select>
                </Col>
                <Col span={8}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Выберите поколение"
                        onChange={onGenerationChange}
                        value={selectedGeneration}
                        disabled={!selectedModel}
                        loading={loading.generations}
                    >
                        {generations.map(generation => (
                            <Option key={generation.id} value={generation.id}>
                                {`${generation.name} (${generation.year_from}-${generation.year_to})`}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>
        </Card>
    );
};

export default CarSelector; 