import React, {useState} from 'react';
import {Card, Image, Typography, Space, Divider, Row, Col, Tag, Button, Input, Modal} from 'antd';
import {CarInfo, Generation} from '../../types/car.types';
import {styles} from './styles';
import {EMPTY_DATA} from "../../constants/empty";
import {DESCRIPTION_PLACEHOLDER, EMULATORS_PLACEHOLDER, FRAMES_PLACEHOLDER} from "../../constants/placeholders";

const {Title, Text, Paragraph} = Typography;

interface TabsContentProps {
    carInfo?: CarInfo | null;
    generations: Generation[];
    selectedBrand: string | null;
    selectedModel: string | null;
    selectedGeneration: string | null;
}

interface SendObjectInterface {
    brand: string | null;
    model: string | null;
    generation: string | null;
    description?: string;
    frames?: string;
    emulators?: string;
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

const keysToCheck = ['description', 'frames', 'emulators'] as const;

const TabsContent: React.FC<TabsContentProps> = ({
                                                     carInfo,
                                                     generations,
                                                     selectedBrand,
                                                     selectedModel,
                                                     selectedGeneration
                                                 }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [fieldsData, setFieldsData] = useState(
        {
            description: carInfo?.description || '',
            frames: carInfo?.frames || '',
            emulators: carInfo?.emulators || '',
        }
    );
    const [isLoading, setIsLoading] = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const {TextArea} = Input;
    const generationObj = generations?.filter(generation => generation.id === selectedGeneration)?.[0];

    const saveHandler = () => {
        setIsLoading(true);

        const resultObj: SendObjectInterface = {
            brand: selectedBrand,
            model: selectedModel,
            generation: selectedGeneration,
        };

        keysToCheck.forEach((key) => {
            if (fieldsData[key] !== carInfo?.[key]) {
                resultObj[key] = fieldsData[key];
            }
        });


        fetch(carInfo?.id
            ? `http://localhost:3002/api/cars/${selectedBrand}/${selectedModel}/${selectedGeneration}`
            : 'http://localhost:3002/api/cars', {
            method: carInfo?.id
                ? 'PUT'
                : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultObj),
        })
            .then(res => res.json())
            .then(() => {
                modal.info(modalSuccessConfig);
            })
            .catch((error) => {
                modal.error(modalErrorConfig(error.message))
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Card style={styles.card}>
            {contextHolder}
            <Row gutter={32} style={styles.flexRow}>
                <Col span={8}>
                    <div style={styles.imageContainer}>
                        <Image
                            src={`http://${generationObj?.photo}`}
                            style={styles.image}
                            preview={true}
                        />
                    </div>
                </Col>
                <Col span={8}>
                    <div>
                        <Title level={3} style={styles.title}>Основная информация</Title>
                        <Space direction="vertical" size="middle" style={{width: '100%'}}>
                            <div style={styles.tagContainer}>
                                <Tag color="blue" style={styles.tag}>Марка</Tag>
                                <Text strong style={styles.text}>{carInfo?.brand || selectedBrand}</Text>
                            </div>
                            <div style={styles.tagContainer}>
                                <Tag color="blue" style={styles.tag}>Модель</Tag>
                                <Text strong style={styles.text}>{carInfo?.model || selectedModel}</Text>
                            </div>
                            <div style={styles.tagContainer}>
                                <Tag color="blue" style={styles.tag}>Поколение</Tag>
                                <Text strong
                                      style={styles.text}>{generationObj?.name} ({generationObj?.year_from}-{generationObj?.year_to})</Text>
                            </div>
                            <div>
                                <Button
                                    type="primary"
                                    onClick={() => setIsEditMode(!isEditMode)}
                                >
                                    {
                                        isEditMode ? 'Отменить редактирование' : 'Редактировать'
                                    }
                                </Button>
                            </div>
                        </Space>
                    </div>
                </Col>
            </Row>

            <Divider style={styles.divider}/>

            <Row>
                <div>
                    <Title level={3} style={styles.title}>Описание</Title>
                    {
                        isEditMode
                            ? (
                                <TextArea
                                    style={styles.textArea}
                                    rows={4}
                                    placeholder={DESCRIPTION_PLACEHOLDER}
                                    onChange={(e) => setFieldsData({...fieldsData, description: e.target.value})}
                                    value={fieldsData?.description || ''}
                                />
                            )
                            : (
                                <Paragraph style={styles.quote}>
                                    {carInfo?.description || EMPTY_DATA}
                                </Paragraph>
                            )
                    }
                </div>

                <Divider style={styles.divider}/>

                <div>
                    <Title level={3} style={styles.title}>Рамки</Title>
                    {
                        isEditMode
                            ? (
                                <TextArea
                                    style={styles.textArea}
                                    rows={4}
                                    placeholder={FRAMES_PLACEHOLDER}
                                    onChange={(e) => setFieldsData({...fieldsData, frames: e.target.value})}
                                    value={fieldsData?.frames || ''}
                                />
                            )
                            : (
                                <Paragraph style={styles.quote}>
                                    {carInfo?.frames || EMPTY_DATA}
                                </Paragraph>
                            )
                    }
                </div>

                <Divider style={styles.divider}/>

                <div>
                    <Title level={3} style={styles.title}>Обманки</Title>
                    {
                        isEditMode
                            ? (
                                <TextArea
                                    style={styles.textArea}
                                    rows={4}
                                    placeholder={EMULATORS_PLACEHOLDER}
                                    onChange={(e) => setFieldsData({...fieldsData, emulators: e.target.value})}
                                    value={fieldsData?.emulators || ''}
                                />
                            )
                            : (
                                <Paragraph style={styles.quote}>
                                    {carInfo?.emulators || EMPTY_DATA}
                                </Paragraph>
                            )
                    }
                </div>
            </Row>

            {
                isEditMode && (
                    <div style={styles.saveButton}>
                        <Button type='primary' onClick={() => saveHandler()}>Сохранить</Button>
                    </div>
                )
            }
        </Card>
    );
};

export default TabsContent;