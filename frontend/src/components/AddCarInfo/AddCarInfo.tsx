import React, {useState} from 'react';
import {Form, Input, Button, Card, Row, Col, Select, Tabs, Modal, Typography} from 'antd';
import {
    BranchesOutlined,
    RadiusSettingOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import {Brand, Model, Generation, CarInfo} from '../../types/car.types';
import {carApi} from '../../api/car.api';
import {handleApiError} from '../../utils/error.utils';

const {Option} = Select;
const {TabPane} = Tabs;

interface AddCarInfoProps {
    selectedBrand: string | null;
    selectedModel: string | null;
    selectedGeneration: string | null;
    carInfo: CarInfo | null;
    brands: Brand[];
    models: Model[];
    generations: Generation[];
}

const modalSuccessConfig = {
    title: 'Успешно',
    content: (
        <>
            <Typography>Данные отправлены на сервер и сохранены</Typography>
        </>
    ),
};

const modalErrorConfig = (error: any) => ({
    title: 'Ошибка',
    content: (
        <>
            <Typography>При сохранении произошла ошибка</Typography>
            <Typography>{error}</Typography>
        </>
    ),
});

const AddCarInfo: React.FC<AddCarInfoProps> = ({
                                                   selectedBrand: defaultSelectedBrand,
                                                   selectedModel: defaultSelectedModel,
                                                   selectedGeneration: defaultSelectedGeneration,
                                                   carInfo: defaultCarInfo,
                                                   brands,
                                               }) => {
    console.log('carInfo', defaultCarInfo, defaultSelectedBrand, defaultSelectedModel, defaultSelectedGeneration);
    const [form] = Form.useForm();
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState({
        brands: false,
        models: false,
        generations: false,
        submit: false
    });
    const [selectedBrand, setSelectedBrand] = React.useState<string>(defaultSelectedBrand || '');
    const [selectedModel, setSelectedModel] = React.useState<string>(defaultSelectedModel || '');
    const [selectedGeneration, setSelectedGeneration] = React.useState<string>(defaultSelectedGeneration || '');
    const [carInfo, setCarInfo] = useState<CarInfo | null>(defaultCarInfo || null);

    const [modal, contextHolder] = Modal.useModal();
    const {TextArea} = Input;

    const handleBrandChange = async (value: string) => {
        setSelectedBrand(value);
        setSelectedModel('');
        setSelectedGeneration('');
        setModels([]);
        setGenerations([]);
        form.resetFields(['model', 'generation']);

        try {
            setLoading(prev => ({...prev, models: true}));
            const modelsData = await carApi.fetchModels(value);
            setModels(modelsData);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке моделей');
        } finally {
            setLoading(prev => ({...prev, models: false}));
        }
    };

    const handleModelChange = async (value: string) => {
        setSelectedModel(value);
        setSelectedGeneration('');
        form.resetFields(['generation']);
        setGenerations([]);

        try {
            setLoading(prev => ({...prev, generations: true}));
            const generationsData = await carApi.fetchGenerations(selectedBrand, value);
            setGenerations(generationsData);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке поколений');
        } finally {
            setLoading(prev => ({...prev, generations: false}));
        }
    };

    const handleGenerationChange = (value: string) => {
        setSelectedGeneration(value);
        setLoading(prev => ({...prev, generations: true}));
        fetch(`http://localhost:3002/api/cars/${selectedBrand}/${selectedModel}/${value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then((data) => {
                console.log('Полученные данные:', data);
                if (data?.message !== "Car not found") {
                    setCarInfo(data);
                    form.setFieldsValue({
                        description: data?.description,
                        frames_specs: data?.frames_specs,
                        frames_issues: data?.frames_issues,
                        emulators_specs: data?.emulators_specs,
                        emulators_issues: data?.emulators_issues,
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    const onFinish = () => {
        setLoading(prev => ({...prev, submit: true}));
        fetch(carInfo?.id
            ? `http://localhost:3002/api/cars/${selectedBrand}/${selectedModel}/${selectedGeneration}`
            : 'http://localhost:3002/api/cars', {
            method: carInfo?.id
                ? 'PUT'
                : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form.getFieldsValue()),
        })
            .then(res => res.json())
            .then(() => {
                modal.info(modalSuccessConfig);
            })
            .catch((error) => {
                modal.error(modalErrorConfig(error.message))
            })
            .finally(() => {
                setLoading(prev => ({...prev, submit: false}));
            });
        form.resetFields();
        setSelectedGeneration('');
    };

    return (
        <Card title="Внести информацию об автомобиле">
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
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span><InfoCircleOutlined/> Основная информация</span>} key="1">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="brand"
                                    label="Марка"
                                    rules={[{required: true, message: 'Пожалуйста, выберите марку'}]}
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
                                        // defaultValue={carInfo?.brand?.id}
                                    >
                                        {brands.map(brand => (
                                            <Option key={brand.id} value={brand.id} label={brand.name}>
                                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                    {brand.logo ? (
                                                        <img
                                                            src={brand.logo}
                                                            alt={brand.name}
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                objectFit: 'contain'
                                                            }}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                console.log('Image load error for brand:', brand.name, 'URL:', brand.logo);
                                                                target.onerror = null;
                                                                target.src = 'https://via.placeholder.com/24x24?text=Logo';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            background: '#f0f0f0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
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
                                    rules={[{required: true, message: 'Пожалуйста, выберите модель'}]}
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
                                    rules={[{required: true, message: 'Пожалуйста, выберите поколение'}]}
                                >
                                    <Select
                                        placeholder="Выберите поколение"
                                        disabled={!form.getFieldValue('model')}
                                        loading={loading.generations}
                                        onChange={handleGenerationChange}
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

                        {
                            selectedGeneration && (
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="description"
                                            label="Дополнительная информация"
                                            rules={[{required: false}]}
                                        >
                                            <TextArea
                                                rows={4}
                                                placeholder="Дополнительное описание"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )
                        }
                    </TabPane>

                    <TabPane disabled={!selectedGeneration} tab={<span><RadiusSettingOutlined/> Рамки</span>} key="3">
                        <Form.Item
                            name="frames_specs"
                            label="Характеристики рамок"
                        >
                            <TextArea rows={4} placeholder="Введите характеристики рамок"/>
                        </Form.Item>

                        <Form.Item
                            name="frames_issues"
                            label="Распространенные проблемы"
                        >
                            <TextArea rows={4} placeholder="Введите распространенные проблемы"/>
                        </Form.Item>
                    </TabPane>

                    <TabPane disabled={!selectedGeneration} tab={<span><BranchesOutlined/> Обманки</span>} key="4">
                        <Form.Item
                            name="emulators_specs"
                            label="Характеристики обманок"
                        >
                            <TextArea rows={4} placeholder="Введите характеристики обманок"/>
                        </Form.Item>

                        <Form.Item
                            name="emulators_issues"
                            label="Распространенные проблемы"
                        >
                            <TextArea rows={4} placeholder="Введите распространенные проблемы"/>
                        </Form.Item>
                    </TabPane>
                </Tabs>

                <Form.Item style={{marginTop: 24}}>
                    <Button type="primary" loading={loading.submit} htmlType="submit">
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>

            {contextHolder}
        </Card>
    );
};

export default AddCarInfo; 