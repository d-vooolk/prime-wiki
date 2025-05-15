import React from 'react';
import { Card, Tabs, List } from 'antd';
import { CarInfo } from '../../types/car.types';

const { TabPane } = Tabs;

interface TabsContentProps {
    carInfo: CarInfo;
}

const TabsContent: React.FC<TabsContentProps> = ({ carInfo }) => {
    return (
        <Card style={{ marginTop: 16 }}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Фары" key="1">
                    <List
                        dataSource={carInfo.headlights}
                        renderItem={(item, index) => (
                            <List.Item key={index}>{item}</List.Item>
                        )}
                    />
                </TabPane>
                <TabPane tab="Рамки" key="2">
                    <List
                        dataSource={carInfo.frames}
                        renderItem={(item, index) => (
                            <List.Item key={index}>{item}</List.Item>
                        )}
                    />
                </TabPane>
                <TabPane tab="Эмуляторы" key="3">
                    <List
                        dataSource={carInfo.emulators}
                        renderItem={(item, index) => (
                            <List.Item key={index}>{item}</List.Item>
                        )}
                    />
                </TabPane>
                <TabPane tab="Крепления" key="4">
                    <List
                        dataSource={carInfo.mounts}
                        renderItem={(item, index) => (
                            <List.Item key={index}>{item}</List.Item>
                        )}
                    />
                </TabPane>
                <TabPane tab="Стёкла" key="5">
                    <List
                        dataSource={carInfo.glass}
                        renderItem={(item, index) => (
                            <List.Item key={index}>{item}</List.Item>
                        )}
                    />
                </TabPane>
                <TabPane tab="Дополнительная информация" key="6">
                    <List
                        dataSource={carInfo.additionalInfo}
                        renderItem={(item, index) => (
                            <List.Item key={index}>{item}</List.Item>
                        )}
                    />
                </TabPane>
            </Tabs>
        </Card>
    );
};

export default TabsContent;