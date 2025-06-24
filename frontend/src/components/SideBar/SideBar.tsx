import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
    CarOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import darkLogo from '../../assets/darkLogo.svg';
import './SideBar.css';

const { Sider } = Layout;

interface SideBarProps {
    onMenuClick: (key: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ onMenuClick }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Sider 
            width={250} 
            className="site-layout-sider"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            trigger={null}
        >
            <div className="logo">
                <img 
                    src={darkLogo} 
                    alt="Logo" 
                    style={{ 
                        width: collapsed ? '32px' : '120px', 
                        height: 'auto',
                        transition: 'all 0.3s'
                    }} 
                />
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                onClick={({ key }) => onMenuClick(key)}
            >
                <Menu.Item key="1" icon={<CarOutlined />}>
                    Выбор автомобиля
                </Menu.Item>
                <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
                    Стёкла фар
                </Menu.Item>
            </Menu>
            <div 
                className="trigger-button"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
        </Sider>
    );
};

export default SideBar;