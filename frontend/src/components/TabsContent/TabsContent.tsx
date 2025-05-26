import React from 'react';
import {Card, Image, Tabs, Typography, Space, Divider, Row, Col, Tag} from 'antd';
import {CarInfo, Generation} from '../../types/car.types';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

interface TabsContentProps {
    carInfo?: CarInfo | null;
    generations: Generation[];
    selectedGeneration: string | null;
}

const TabsContent: React.FC<TabsContentProps> = ({ carInfo, generations, selectedGeneration }) => {
    const generationObj = generations?.filter(generation => generation.id === selectedGeneration)?.[0];

    const quoteStyle = {
        fontSize: '16px',
        lineHeight: '1.6',
        color: 'rgba(0, 0, 0, 0.85)',
        background: '#f5f5f5',
        padding: '16px 24px',
        borderRadius: '8px',
        borderLeft: '4px solid #1890ff',
        margin: 0,
        position: 'relative' as const,
        fontStyle: 'italic' as const
    };

    return (
        <Card 
            style={{ 
                marginTop: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                borderRadius: '12px',
                overflow: 'hidden'
            }}
        >
            <Tabs 
                defaultActiveKey="1" 
                size="large"
                tabBarStyle={{ 
                    marginBottom: '24px',
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <TabPane tab="Данные" key="1">
                    <Row gutter={32}>
                        <Col span={8}>
                            <div style={{ 
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                height: 'fit-content'
                            }}>
                                <Image 
                                    src={`http://${generationObj?.photo}`} 
                                    style={{ 
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        objectFit: 'contain'
                                    }}
                                    preview={true}
                                />
                            </div>
                        </Col>
                        <Col span={16}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div>
                                    <Title level={3} style={{ marginBottom: '16px' }}>Основная информация</Title>
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Tag color="blue" style={{ margin: 0 }}>Марка</Tag>
                                            <Text strong style={{ fontSize: '16px' }}>{carInfo?.brand}</Text>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Tag color="blue" style={{ margin: 0 }}>Модель</Tag>
                                            <Text strong style={{ fontSize: '16px' }}>{carInfo?.model}</Text>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Tag color="blue" style={{ margin: 0 }}>Поколение</Tag>
                                            <Text strong style={{ fontSize: '16px' }}>{generationObj?.name} ({generationObj?.year_from}-{generationObj?.year_to})</Text>
                                        </div>
                                    </Space>
                                </div>
                                <Divider style={{ margin: '24px 0' }} />
                                <div>
                                    <Title level={3} style={{ marginBottom: '16px' }}>Описание</Title>
                                    <Paragraph style={quoteStyle}>
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
                            <Title level={3} style={{ marginBottom: '16px' }}>Типы рамок</Title>
                            <Paragraph style={quoteStyle}>
                                {carInfo?.frames_specs}
                            </Paragraph>
                        </div>
                        <Divider style={{ margin: '24px 0' }} />
                        <div>
                            <Title level={3} style={{ marginBottom: '16px' }}>Особенности рамок</Title>
                            <Paragraph style={quoteStyle}>
                                {carInfo?.frames_issues}
                            </Paragraph>
                        </div>
                    </Space>
                </TabPane>
                <TabPane tab="Обманки" key="3">
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                            <Title level={3} style={{ marginBottom: '16px' }}>Типы обманок</Title>
                            <Paragraph style={quoteStyle}>
                                {carInfo?.emulators_specs}
                            </Paragraph>
                        </div>
                        <Divider style={{ margin: '24px 0' }} />
                        <div>
                            <Title level={3} style={{ marginBottom: '16px' }}>Особенности обманок</Title>
                            <Paragraph style={quoteStyle}>
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