import React from 'react';
import {Card, Image, Tabs, Typography} from 'antd';
import {CarInfo, Generation} from '../../types/car.types';

const { TabPane } = Tabs;

interface TabsContentProps {
    carInfo?: CarInfo | null;
    generations: Generation[];
    selectedGeneration: string | null;
}

const TabsContent: React.FC<TabsContentProps> = ({ carInfo, generations, selectedGeneration }) => {
    const generationObj = generations.filter(generation => generation.id === selectedGeneration)[0];
    const { name, year_from, year_to } = generationObj;
    console.log('generationObj', generationObj)
    return (
        <Card style={{ marginTop: 16 }}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Данные" key="1">
                    <Image src={`http://${generationObj?.photo}`} style={{ maxWidth: "300px" }} />
                    <Typography>Марка: { carInfo?.brand }</Typography>
                    <Typography>Модель: { carInfo?.model }</Typography>
                    <Typography>Поколение: { name } ({year_from}-{year_to}</Typography>
                    <Typography>Информация: { carInfo?.description }</Typography>
                </TabPane>
                <TabPane tab="Рамки" key="2">
                    <Typography>Типы рамок: { carInfo?.frames_specs }</Typography>
                    <Typography>Особенности рамок: { carInfo?.frames_issues }</Typography>
                </TabPane>
                <TabPane tab="Обманки" key="3">
                    <Typography>Типы обманок: { carInfo?.emulators_specs }</Typography>
                    <Typography>Особенности обманок: { carInfo?.emulators_issues }</Typography>
                </TabPane>
            </Tabs>
        </Card>
    );
};

export default TabsContent;