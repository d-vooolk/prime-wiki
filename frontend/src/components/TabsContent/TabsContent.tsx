import React, {useState, useEffect} from 'react';
import {Card, Image, Typography, Space, Divider, Row, Col, Tag, Button, Input, Modal, Upload, message, Popconfirm} from 'antd';
import {UploadOutlined, DeleteOutlined, PlayCircleOutlined} from '@ant-design/icons';
import {styles} from './styles';
import {EMPTY_DATA} from "../../constants/empty";
import {DESCRIPTION_PLACEHOLDER, EMULATORS_PLACEHOLDER, FRAMES_PLACEHOLDER} from "../../constants/placeholders";
import {TabsContentProps} from "./interface";
import {MediaFile} from "../../types/car.types";
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

const {Title, Text, Paragraph} = Typography;

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
    const [mediaFiles, setMediaFiles] = useState({
        photos: carInfo?.photos || [],
        videos: carInfo?.videos || []
    });
    const [selectedFiles, setSelectedFiles] = useState<{ photos: RcFile[]; videos: RcFile[] }>({ photos: [], videos: [] });
    const [videoModal, setVideoModal] = useState<{visible: boolean, src: string}>({visible: false, src: ''});

    const [modal, contextHolder] = Modal.useModal();

    const {TextArea} = Input;
    const generationObj = generations?.filter(generation => generation.id === selectedGeneration)?.[0];

    useEffect(() => {
        setFieldsData({
            description: carInfo?.description || '',
            frames: carInfo?.frames || '',
            emulators: carInfo?.emulators || '',
        });
        setMediaFiles({
            photos: carInfo?.photos || [],
            videos: carInfo?.videos || []
        });
    }, [carInfo]);

    const saveHandler = async () => {
        setIsLoading(true);

        const formData = new FormData();
        
        // Добавляем текстовые данные
        formData.append('brand', selectedBrand || '');
        formData.append('model', selectedModel || '');
        formData.append('generation', selectedGeneration || '');
        
        if (fieldsData.description !== carInfo?.description) {
            formData.append('description', fieldsData.description);
        }
        if (fieldsData.frames !== carInfo?.frames) {
            formData.append('frames', fieldsData.frames);
        }
        if (fieldsData.emulators !== carInfo?.emulators) {
            formData.append('emulators', fieldsData.emulators);
        }

        // Добавляем выбранные файлы
        selectedFiles.photos.forEach((file) => {
            formData.append('photos', file);
        });
        selectedFiles.videos.forEach((file) => {
            formData.append('videos', file);
        });

        try {
            const response = await fetch(
                carInfo?.id
                    ? `http://localhost:3002/api/cars/${selectedBrand}/${selectedModel}/${selectedGeneration}`
                    : 'http://localhost:3002/api/cars',
                {
                    method: carInfo?.id ? 'PUT' : 'POST',
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                setFieldsData({
                    description: data?.description || '',
                    frames: data?.frames || '',
                    emulators: data?.emulators || '',
                });
                setMediaFiles({
                    photos: data?.photos || [],
                    videos: data?.videos || []
                });
                setSelectedFiles({ photos: [], videos: [] }); // Очищаем выбранные файлы
                modal.info(modalSuccessConfig);
            } else {
                const errorData = await response.json();
                modal.error(modalErrorConfig(errorData.message || 'Ошибка при сохранении'));
            }
        } catch (error) {
            modal.error(modalErrorConfig(error instanceof Error ? error.message : 'Ошибка при сохранении'));
        } finally {
            setIsLoading(false);
            setIsEditMode(false);
        }
    };

    const deleteMedia = async (type: 'photos' | 'videos', filename: string) => {
        try {
            const response = await fetch(
                `http://localhost:3002/api/cars/${selectedBrand}/${selectedModel}/${selectedGeneration}/media/${type}/${filename}`,
                {
                    method: 'DELETE',
                }
            );

            if (response.ok) {
                setMediaFiles(prev => ({
                    ...prev,
                    [type]: prev[type].filter((file: MediaFile) => file.filename !== filename)
                }));
                message.success('Файл удален');
            } else {
                message.error('Ошибка при удалении файла');
            }
        } catch (error) {
            message.error('Ошибка при удалении файла');
        }
    };

    const renderMediaSection = (type: 'photos' | 'videos', title: string) => (
        <div>
            <Title level={3} style={styles.title}>{title}</Title>
            {isEditMode && (
                <div style={{ marginBottom: 16 }}>
                    <Upload
                        beforeUpload={(file) => {
                            setSelectedFiles((prev) => ({ ...prev, [type]: [...prev[type], file as RcFile] }));
                            return false;
                        }}
                        fileList={selectedFiles[type].map((file, idx) => ({
                            uid: file.uid || idx.toString(),
                            name: file.name,
                            status: 'done',
                            originFileObj: file
                        }) as UploadFile<any>)}
                        onRemove={(file) => {
                            setSelectedFiles((prev) => ({
                                ...prev,
                                [type]: prev[type].filter((f) => f.uid !== file.uid)
                            }));
                            return true;
                        }}
                        multiple
                        accept={type === 'photos' ? 'image/*' : 'video/*'}
                        showUploadList={true}
                    >
                        <Button icon={<UploadOutlined />}>
                            Выбрать {type === 'photos' ? 'фото' : 'видео'}
                        </Button>
                    </Upload>
                </div>
            )}
            
            {mediaFiles[type].length > 0 ? (
                <Row gutter={[16, 16]}>
                    {mediaFiles[type].map((file: MediaFile) => (
                        <Col key={file.filename} xs={24} sm={12} md={8} lg={6} style={{ minWidth: 220 }}>
                            <Card
                                hoverable
                                style={{ position: 'relative', width: 220 }}
                                bodyStyle={{ padding: 8 }}
                                onClick={type === 'videos' ? () => setVideoModal({visible: true, src: `http://localhost:3002/uploads/videos/${file.filename}`}) : undefined}
                            >
                                {type === 'photos' ? (
                                    <Image
                                        src={`http://localhost:3002/uploads/photos/${file.filename}`}
                                        alt={file.originalname}
                                        style={{ width: '200px', height: 150, objectFit: 'cover' }}
                                        preview={true}
                                    />
                                ) : (
                                    <div style={{ position: 'relative', height: 150, width: 200, cursor: 'pointer' }}>
                                        <video
                                            src={`http://localhost:3002/uploads/videos/${file.filename}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            controls
                                            onClick={e => { e.stopPropagation(); setVideoModal({visible: true, src: `http://localhost:3002/uploads/videos/${file.filename}`}); }}
                                        />
                                        <PlayCircleOutlined 
                                            style={{ 
                                                position: 'absolute', 
                                                top: '50%', 
                                                left: '50%', 
                                                transform: 'translate(-50%, -50%)',
                                                fontSize: 24,
                                                color: 'white',
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                                pointerEvents: 'auto',
                                                cursor: 'pointer'
                                            }} 
                                            onClick={e => { e.stopPropagation(); setVideoModal({visible: true, src: `http://localhost:3002/uploads/videos/${file.filename}`}); }}
                                        />
                                    </div>
                                )}
                                
                                <div style={{ marginTop: 8 }}>
                                    {isEditMode && (
                                        <Popconfirm
                                            title="Удалить файл?"
                                            onConfirm={() => deleteMedia(type, file.filename)}
                                            okText="Да"
                                            cancelText="Нет"
                                        >
                                            <Button 
                                                type="text" 
                                                danger 
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                style={{ float: 'right' }}
                                            />
                                        </Popconfirm>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Paragraph style={styles.quote}>
                    {EMPTY_DATA}
                </Paragraph>
            )}
            <Modal
                open={videoModal.visible}
                onCancel={() => setVideoModal({visible: false, src: ''})}
                footer={null}
                width={800}
                bodyStyle={{ padding: 0, textAlign: 'center' }}
                destroyOnClose
            >
                {videoModal.src && (
                    <video
                        src={videoModal.src}
                        style={{ width: '100%', maxHeight: '80vh', background: '#000' }}
                        controls
                        autoPlay
                    />
                )}
            </Modal>
        </div>
    );

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
                                    {fieldsData?.description || EMPTY_DATA}
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
                                    {fieldsData?.frames || EMPTY_DATA}
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
                                    {fieldsData?.emulators || EMPTY_DATA}
                                </Paragraph>
                            )
                    }
                </div>

                <Divider style={styles.divider}/>

                {renderMediaSection('photos', 'Фотографии')}

                <Divider style={styles.divider}/>

                {renderMediaSection('videos', 'Видео')}
            </Row>

            {
                isEditMode && (
                    <div style={styles.saveButton}>
                        <Button
                            type='primary'
                            onClick={() => saveHandler()}
                            disabled={isLoading}
                        >
                            Сохранить
                        </Button>
                    </div>
                )
            }
        </Card>
    );
};

export default TabsContent;