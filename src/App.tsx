import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { CarInfo, Brand, Model, Generation } from "./types/car.types";
import SideBar from "./components/SideBar/SideBar";
import MainContent from "./components/MainContent/MainContent";
import { carApi } from './api/car.api';
import { handleApiError } from './utils/error.utils';

const App: React.FC = () => {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);
    const [carInfo, setCarInfo] = useState<CarInfo | null>(null);
    const [activeKey, setActiveKey] = useState<string>('1');
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState({
        brands: false,
        models: false,
        generations: false,
        carInfo: false
    });

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

    const handleBrandChange = async (brandId: string) => {
        setSelectedBrand(brandId);
        setSelectedModel(null);
        setSelectedGeneration(null);
        setCarInfo(null);
        setModels([]);
        setGenerations([]);

        try {
            setLoading(prev => ({ ...prev, models: true }));
            const modelsData = await carApi.fetchModels(brandId);
            setModels(modelsData);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке моделей');
        } finally {
            setLoading(prev => ({ ...prev, models: false }));
        }
    };

    const handleModelChange = async (modelId: string) => {
        setSelectedModel(modelId);
        setSelectedGeneration(null);
        setCarInfo(null);
        setGenerations([]);

        if (selectedBrand) {
            try {
                setLoading(prev => ({ ...prev, generations: true }));
                const generationsData = await carApi.fetchGenerations(selectedBrand, modelId);
                setGenerations(generationsData);
            } catch (error) {
                handleApiError(error, 'Ошибка при загрузке поколений');
            } finally {
                setLoading(prev => ({ ...prev, generations: false }));
            }
        }
    };

    const handleGenerationChange = async (generationId: string) => {
        setSelectedGeneration(generationId);
        // TODO: Implement car info fetch from our backend
        setCarInfo(null);
        /* Temporarily commented out until our backend is ready
        try {
            setLoading(prev => ({ ...prev, carInfo: true }));
            const carInfoData = await carApi.fetchCarInfo(generationId);
            setCarInfo(carInfoData);
        } catch (error) {
            handleApiError(error, 'Ошибка при загрузке информации об автомобиле');
        } finally {
            setLoading(prev => ({ ...prev, carInfo: false }));
        }
        */
    };

    const handleMenuClick = (key: string) => {
        setActiveKey(key);
    };

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Layout style={{ flex: 1, display: 'flex' }}>
                <SideBar onMenuClick={handleMenuClick} />
                <MainContent
                    selectedBrand={selectedBrand}
                    selectedModel={selectedModel}
                    selectedGeneration={selectedGeneration}
                    carInfo={carInfo}
                    brands={brands}
                    models={models}
                    generations={generations}
                    onBrandChange={handleBrandChange}
                    onModelChange={handleModelChange}
                    onGenerationChange={handleGenerationChange}
                    activeKey={activeKey}
                    loading={loading}
                />
            </Layout>
        </Layout>
    );
};

export default App;