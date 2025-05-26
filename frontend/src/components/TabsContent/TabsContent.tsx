import React from 'react';
import {Card, Image, Tabs, Typography, Space, Divider, Row, Col, Tag} from 'antd';
import {CarInfo, Generation} from '../../types/car.types';
import { styles } from './styles';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

interface TabsContentProps {
    carInfo?: CarInfo | null;
    generations: Generation[];
    selectedGeneration: string | null;
}

const TabsContent: React.FC<TabsContentProps> = ({ carInfo, generations, selectedGeneration }) => {
    const generationObj = generations?.filter(generation => generation.id === selectedGeneration)?.[0];

    return (
        <Card style={styles.card}>
            <Tabs 
                defaultActiveKey="1" 
                size="large"
                tabBarStyle={styles.tabs.tabBar}
            >
                <TabPane tab="Данные" key="1">
                    <Row gutter={32}>
                        <Col span={8}>
                            <div style={styles.imageContainer}>
                                <Image 
                                    src={`http://${generationObj?.photo}`} 
                                    style={styles.image}
                                    preview={true}
                                />
                            </div>
                        </Col>
                        <Col span={16}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div>
                                    <Title level={3} style={styles.title}>Основная информация</Title>
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <div style={styles.tagContainer}>
                                            <Tag color="blue" style={styles.tag}>Марка</Tag>
                                            <Text strong style={styles.text}>{carInfo?.brand}</Text>
                                        </div>
                                        <div style={styles.tagContainer}>
                                            <Tag color="blue" style={styles.tag}>Модель</Tag>
                                            <Text strong style={styles.text}>{carInfo?.model}</Text>
                                        </div>
                                        <div style={styles.tagContainer}>
                                            <Tag color="blue" style={styles.tag}>Поколение</Tag>
                                            <Text strong style={styles.text}>{generationObj?.name} ({generationObj?.year_from}-{generationObj?.year_to})</Text>
                                        </div>
                                    </Space>
                                </div>
                                <Divider style={styles.divider} />
                                <div>
                                    <Title level={3} style={styles.title}>Описание</Title>
                                    <Paragraph style={styles.quote}>
                                        {carInfo?.description}
                                    </Paragraph>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Рамки" key="2">
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                            <Title level={3} style={styles.title}>Типы рамок</Title>
                            <Paragraph style={styles.quote}>
                                {carInfo?.frames_specs}
                            </Paragraph>
                        </div>
                        <Divider style={styles.divider} />
                        <div>
                            <Title level={3} style={styles.title}>Особенности рамок</Title>
                            <Paragraph style={styles.quote}>
                                {carInfo?.frames_issues}
                            </Paragraph>
                        </div>
                    </Space>
                </TabPane>
                <TabPane tab="Обманки" key="3">
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                            <Title level={3} style={styles.title}>Типы обманок</Title>
                            <Paragraph style={styles.quote}>
                                {carInfo?.emulators_specs}
                            </Paragraph>
                        </div>
                        <Divider style={styles.divider} />
                        <div>
                            <Title level={3} style={styles.title}>Особенности обманок</Title>
                            <Paragraph style={styles.quote}>
                                {carInfo?.emulators_issues}
                            </Paragraph>
                        </div>
                    </Space>
                </TabPane>
            </Tabs>
        </Card>
    );
};

export default TabsContent;