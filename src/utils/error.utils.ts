import { message } from 'antd';

export const handleApiError = (error: unknown, customMessage?: string) => {
    console.error('API Error:', error);
    message.error(customMessage || 'Произошла ошибка при загрузке данных');
}; 