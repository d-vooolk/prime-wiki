import React from 'react';
import { Form, Select, Row, Col, Card } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import { Brand, Model, Generation } from '../../types/car.types';

interface CarSelectorProps {
    brands: Brand[];
    models: Model[];
    generations: Generation[];
    selectedBrand: string | null;
    selectedModel: string | null;
    selectedGeneration: string | null;
    onBrandChange: (brand: string) => void;
    onModelChange: (model: string) => void;
    onGenerationChange: (generation: string) => void;
    loading: {
        brands: boolean;
        models: boolean;
        generations: boolean;
        carInfo: boolean;
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
    const handleBrandChange = (value: string) => {
        onBrandChange(value);
    };

    const handleModelChange = (value: string) => {
        onModelChange(value);
    };

    const handleGenerationChange = (value: string) => {
        onGenerationChange(value);
    };

    return (
        <Card 
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CarOutlined style={{ fontSize: '20px' }} />
                    <span>Выбор автомобиля</span>
                </div>
            }
            style={{ 
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px'
            }}
        >
            <Form layout="vertical">
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item 
                            label="Марка"
                            style={{ marginBottom: 0 }}
                        >
                            <Select 
                                onChange={handleBrandChange} 
                                value={selectedBrand || undefined} 
                                loading={loading.brands}
                                placeholder="Выберите марку"
                                style={{ width: '100%' }}
                            >
                                {brands.map(brand => (
                                    <Select.Option key={brand.id} value={brand.id}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            {brand.logo && (
                                                <img
                                                    src={brand.logo}
                                                    alt={brand.name}
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        marginRight: '8px',
                                                        objectFit: 'contain',
                                                    }}
                                                />
                                            )}
                                            <span>{brand.name}</span>
                                        </div>
                                    </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item 
                            label="Модель"
                            style={{ marginBottom: 0 }}
                        >
                            <Select 
                                onChange={handleModelChange} 
                                value={selectedModel || undefined}
                                disabled={!selectedBrand}
                                loading={loading.models}
                                placeholder="Выберите модель"
                                style={{ width: '100%' }}
                            >
                                {models.map(model => (
                                    <Select.Option key={model.id} value={model.id}>{model.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item 
                            label="Поколение"
                            style={{ marginBottom: 0 }}
                        >
                            <Select 
                                onChange={handleGenerationChange}
                                value={selectedGeneration || undefined}
                                disabled={!selectedModel}
                                loading={loading.generations}
                                placeholder="Выберите поколение"
                                style={{ width: '100%' }}
                            >
                                {generations.map(generation => (
                                    <Select.Option key={generation.id} value={generation.id}>
                                        {`${generation.name} (${generation.year_from}-${generation.year_to})`}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default CarSelector; 