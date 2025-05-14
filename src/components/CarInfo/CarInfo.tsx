import React from 'react';
import { Card, Tabs } from 'antd';
import {
    ApiOutlined,
    BranchesOutlined,
    CarOutlined,
    RadiusSettingOutlined,
    SoundOutlined,
    StarOutlined
} from "@ant-design/icons";

const { TabPane } = Tabs;

interface CarInfoProps {
    brandId: string | null;
    modelId: string | null;
    generationId: string | null;
}

const CarInfo: React.FC<CarInfoProps> = ({
    brandId,
    modelId,
    generationId
}) => {
    return (
        <Card style={{ marginTop: 16 }}>
            <Tabs defaultActiveKey="1">
                <TabPane tab={<span><SoundOutlined /> Фары</span>} key="1">
                    <p>Информация о фарах</p>
                </TabPane>
                <TabPane tab={<span><RadiusSettingOutlined /> Рамки</span>} key="2">
                    <p>Информация о рамках</p>
                </TabPane>
                <TabPane tab={<span><BranchesOutlined /> Обманки</span>} key="3">
                    <p>Информация об обманках</p>
                </TabPane>
                <TabPane tab={<span><ApiOutlined /> Крепления</span>} key="4">
                    <p>Информация о креплениях</p>
                </TabPane>
                <TabPane tab={<span><CarOutlined /> Стёкла</span>} key="5">
                    <p>Информация о стёклах</p>
                </TabPane>
                <TabPane tab={<span><StarOutlined /> Дополнительная информация</span>} key="6">
                    <p>Дополнительная информация</p>
                </TabPane>
            </Tabs>
        </Card>
    );
};

export default CarInfo; 