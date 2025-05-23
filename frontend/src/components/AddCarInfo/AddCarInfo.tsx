import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Select, Tabs, message, Checkbox } from 'antd';
import {
    ApiOutlined,
    BranchesOutlined,
    CarOutlined,
    RadiusSettingOutlined,
    SoundOutlined,
    StarOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import { Brand, Model, Generation, CarFormData } from '../../types/car.types';
import { carApi } from '../../api/car.api';
import { handleApiError } from '../../utils/error.utils';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface AddCarInfoProps {
    activeKey: string;
}

const AddCarInfo: React.FC<AddCarInfoProps> = ({ activeKey }) => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = React.useState('1');
    
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState({
        brands: false,
        models: false,
        generations: false,
        submit: false
    });
    const [selectedBrand, setSelectedBrand] = React.useState<string>('');
    const [selectedModel, setSelectedModel] = React.useState<string>('');

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(prev => ({ ...prev, brands: true }));
            const brandsData = await carApi.fetchBrands();
            setBrands(brandsData);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке марок');
        } finally {
            setLoading(prev => ({ ...prev, brands: false }));
        }
    };

    const fetchModels = async (markId: string) => {
        try {
            setLoading(prev => ({ ...prev, models: true }));
            const modelsData = await carApi.fetchModels(markId);
            setModels(modelsData);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке моделей');
        } finally {
            setLoading(prev => ({ ...prev, models: false }));
        }
    };

    const fetchGenerations = async (markId: string, modelId: string) => {
        try {
            setLoading(prev => ({ ...prev, generations: true }));
            const generationsData = await carApi.fetchGenerations(markId, modelId);
            setGenerations(generationsData);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке поколений');
        } finally {
            setLoading(prev => ({ ...prev, generations: false }));
        }
    };

    const handleBrandChange = async (value: string) => {
        setSelectedBrand(value);
        setSelectedModel('');
        setModels([]);
        setGenerations([]);

        try {
            setLoading(prev => ({ ...prev, models: true }));
            const modelsData = await carApi.fetchModels(value);
            setModels(modelsData);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке моделей');
        } finally {
            setLoading(prev => ({ ...prev, models: false }));
        }
    };

    const handleModelChange = async (value: string) => {
        setSelectedModel(value);
        setGenerations([]);

        try {
            setLoading(prev => ({ ...prev, generations: true }));
            const generationsData = await carApi.fetchGenerations(selectedBrand, value);
            setGenerations(generationsData);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке поколений');
        } finally {
            setLoading(prev => ({ ...prev, generations: false }));
        }
    };

    const onFinish = async (values: CarFormData) => {
        try {
            setLoading(prev => ({ ...prev, submit: true }));
            await carApi.addCarInfo(values);
            message.success('Информация успешно сохранена');
            form.resetFields();
        } catch (error) {
            handleApiError(error, 'Произошла ошибка при сохранении данных');
        } finally {
            setLoading(prev => ({ ...prev, submit: false }));
        }
    };

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    return (
        <Card title="Внести информацию об автомобиле" bordered={false}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    brand: undefined,
                    model: undefined,
                    generation: undefined
                }}
            >
                <Tabs defaultActiveKey="1" onChange={handleTabChange}>
                    <TabPane tab={<span><InfoCircleOutlined /> Основная информация</span>} key="1">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="brand"
                                    label="Марка"
                                    rules={[{ required: true, message: 'Пожалуйста, выберите марку' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Выберите марку"
                                        onChange={handleBrandChange}
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
                                                    {brand.logo ? (
                                                        <img 
                                                            src={brand.logo} 
                                                            alt={brand.name} 
                                                            style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                console.log('Image load error for brand:', brand.name, 'URL:', brand.logo);
                                                                target.onerror = null;
                                                                target.src = 'https://via.placeholder.com/24x24?text=Logo';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '24px', height: '24px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {brand.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    {brand.name}
                                                </div>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="model"
                                    label="Модель"
                                    rules={[{ required: true, message: 'Пожалуйста, выберите модель' }]}
                                >
                                    <Select 
                                        placeholder="Выберите модель"
                                        disabled={!form.getFieldValue('brand')}
                                        onChange={handleModelChange}
                                        loading={loading.models}
                                    >
                                        {models.map(model => (
                                            <Option key={model.id} value={model.id}>{model.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="generation"
                                    label="Поколение"
                                    rules={[{ required: true, message: 'Пожалуйста, выберите поколение' }]}
                                >
                                    <Select 
                                        placeholder="Выберите поколение"
                                        disabled={!form.getFieldValue('model')}
                                        loading={loading.generations}
                                    >
                                        {generations.map(generation => (
                                            <Option key={generation.id} value={generation.id}>
                                                {`${generation.name} (${generation.year_from}-${generation.year_to})`}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tab={<span><SoundOutlined /> Фары</span>} key="2">
                        <Form.Item
                            name="headlight_types"
                            label="Тип фар"
                        >
                            <Checkbox.Group>
                                <Row>
                                    <Col span={24}>
                                        <Checkbox value="halogen">Галоген</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="xenon">Ксенон</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="led">LED</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="adaptive">Adaptive</Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>

                        <Form.Item
                            name="headlights_description"
                            label="Описание фар"
                        >
                            <TextArea rows={4} placeholder="Введите описание фар" />
                        </Form.Item>
                    </TabPane>

                    <TabPane tab={<span><RadiusSettingOutlined /> Рамки</span>} key="3">
                        <Form.Item
                            name="frames_specs"
                            label="Характеристики рамок"
                        >
                            <TextArea rows={4} placeholder="Введите характеристики рамок" />
                        </Form.Item>

                        <Form.Item
                            name="frames_issues"
                            label="Распространенные проблемы"
                        >
                            <TextArea rows={4} placeholder="Введите распространенные проблемы" />
                        </Form.Item>
                    </TabPane>

                    <TabPane tab={<span><BranchesOutlined /> Обманки</span>} key="4">
                        <Form.Item
                            name="emulators_specs"
                            label="Характеристики обманок"
                        >
                            <TextArea rows={4} placeholder="Введите характеристики обманок" />
                        </Form.Item>

                        <Form.Item
                            name="emulators_issues"
                            label="Распространенные проблемы"
                        >
                            <TextArea rows={4} placeholder="Введите распространенные проблемы" />
                        </Form.Item>
                    </TabPane>

                    <TabPane tab={<span><ApiOutlined /> Крепления</span>} key="5">
                        <Form.Item
                            name="mounts_specs"
                            label="Характеристики креплений"
                        >
                            <TextArea rows={4} placeholder="Введите характеристики креплений" />
                        </Form.Item>

                        <Form.Item
                            name="mounts_issues"
                            label="Распространенные проблемы"
                        >
                            <TextArea rows={4} placeholder="Введите распространенные проблемы" />
                        </Form.Item>
                    </TabPane>

                    <TabPane tab={<span><CarOutlined /> Стёкла</span>} key="6">
                        <Form.Item
                            name="glass_specs"
                            label="Характеристики стёкол"
                        >
                            <TextArea rows={4} placeholder="Введите характеристики стёкол" />
                        </Form.Item>

                        <Form.Item
                            name="glass_issues"
                            label="Распространенные проблемы"
                        >
                            <TextArea rows={4} placeholder="Введите распространенные проблемы" />
                        </Form.Item>
                    </TabPane>

                    <TabPane tab={<span><StarOutlined /> Дополнительная информация</span>} key="7">
                        <Form.Item
                            name="additional_info"
                            label="Дополнительная информация"
                        >
                            <TextArea rows={4} placeholder="Введите дополнительную информацию" />
                        </Form.Item>

                        <Form.Item
                            name="additional_issues"
                            label="Распространенные проблемы"
                        >
                            <TextArea rows={4} placeholder="Введите распространенные проблемы" />
                        </Form.Item>
                    </TabPane>
                </Tabs>

                <Form.Item style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" loading={loading.submit}>
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddCarInfo; 