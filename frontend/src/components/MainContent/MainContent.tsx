import React from 'react';
import { Layout } from 'antd';
import CustomBreadcrumb from '../Breadcrumb/Breadcrumb';
import CarSelector from '../CarSelector/CarSelector';
import TabsContent from '../TabsContent/TabsContent';
import { CarInfo, Brand, Model, Generation } from '../../types/car.types';

const { Content } = Layout;

interface MainContentProps {
    activeKey: string;
    brands: Brand[];
    models: Model[];
    generations: Generation[];
    selectedBrand: string | null;
    selectedModel: string | null;
    selectedGeneration: string | null;
    carInfo: CarInfo | null;
    onBrandChange: (brandId: string) => void;
    onModelChange: (modelId: string) => void;
    onGenerationChange: (generationId: string) => void;
    loading: {
        brands: boolean;
        models: boolean;
        generations: boolean;
        carInfo: boolean;
    };
}

const MainContent: React.FC<MainContentProps> = ({
    activeKey,
    brands,
    models,
    generations,
    selectedBrand,
    selectedModel,
    selectedGeneration,
    carInfo,
    onBrandChange,
    onModelChange,
    onGenerationChange,
    loading
}) => {
    console.log('carInfo', carInfo)
    return (
        <Layout>
            <Content style={{ margin: '0 16px' }}>
                {activeKey === '1' && (
                    <>
                        <CustomBreadcrumb
                            selectedBrand={selectedBrand}
                            selectedModel={selectedModel}
                            selectedGeneration={selectedGeneration}
                            brands={brands}
                            models={models}
                            generations={generations}
                        />
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <CarSelector
                                brands={brands}
                                models={models}
                                generations={generations}
                                selectedBrand={selectedBrand}
                                selectedModel={selectedModel}
                                selectedGeneration={selectedGeneration}
                                onBrandChange={onBrandChange}
                                onModelChange={onModelChange}
                                onGenerationChange={onGenerationChange}
                                loading={loading}
                            />

                            {
                                carInfo && generations && selectedGeneration && (
                                    <TabsContent
                                        carInfo={carInfo}
                                        generations={generations}
                                        selectedBrand={selectedBrand}
                                        selectedModel={selectedModel}
                                        selectedGeneration={selectedGeneration}
                                    />
                                )
                            }
                        </div>
                    </>
                )}
                { activeKey === '2' && (
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                       in developing ...
                    </div>
                )}
            </Content>
        </Layout>
    );
};

export default MainContent; 