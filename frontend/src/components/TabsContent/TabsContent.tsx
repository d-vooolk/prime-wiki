import React from 'react';
import {Card, Image, Typography, Space, Divider, Row, Col, Tag} from 'antd';
import {CarInfo, Generation} from '../../types/car.types';
import {styles} from './styles';
import {EMPTY_DATA} from "../../constants/empty";

const {Title, Text, Paragraph} = Typography;

interface TabsContentProps {
    carInfo?: CarInfo | null;
    generations: Generation[];
    selectedBrand: string | null;
    selectedModel: string | null;
    selectedGeneration: string | null;
}

const TabsContent: React.FC<TabsContentProps> = ({
                                                     carInfo,
                                                     generations,
                                                     selectedBrand,
                                                     selectedModel,
                                                     selectedGeneration
                                                 }) => {
    const generationObj = generations?.filter(generation => generation.id === selectedGeneration)?.[0];

    return (
        <Card style={styles.card}>
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
                            </Space>
                        </div>
                </Col>
            </Row>

            <Divider style={styles.divider}/>

            <Row>
                <div>
                    <Title level={3} style={styles.title}>Описание</Title>
                    <Paragraph style={styles.quote}>
                        {carInfo?.description || EMPTY_DATA}
                    </Paragraph>
                </div>

                <Divider style={styles.divider}/>

                <div>
                    <Title level={3} style={styles.title}>Типы рамок</Title>
                    <Paragraph style={styles.quote}>
                        {carInfo?.frames_specs || EMPTY_DATA}
                    </Paragraph>
                </div>

                <Divider style={styles.divider}/>

                <div>
                    <Title level={3} style={styles.title}>Типы обманок</Title>
                    <Paragraph style={styles.quote}>
                        {carInfo?.emulators_specs || EMPTY_DATA}
                    </Paragraph>
                </div>
            </Row>
        </Card>
    );
};

export default TabsContent;