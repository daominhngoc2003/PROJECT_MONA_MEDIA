import { Link, Outlet } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
// import { AntDesignOutlined } from '@ant-design/icons';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    WindowsOutlined,
    UnorderedListOutlined,
    PlusOutlined,
    BarsOutlined,
    CommentOutlined,
    AreaChartOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Dropdown } from 'antd';
import { getDecodedAccessToken } from "../../decoder";
import { GetUserById } from "../../api/User";


////////////////////////////////////////////////////////////
const AdminLayout = () => {
    const { Header, Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const token: any = getDecodedAccessToken();
    const [user, setUser] = useState<any>({});

    useEffect(() => {
        const fetUser = async () => {
            const { data } = await GetUserById(token?._id);
            if (data.success) {
                setUser(data.user)
            }
        }
        fetUser();
    })


    const items = [
        {
            key: `user-email`,
            icon: <i className="fa-solid fa-envelope"></i>,
            label: (<Link to="#">{user?.user_email}</Link>),
        },
        {
            key: `user-infomation`,
            icon: <i className="fa-solid fa-circle-info"></i>,
            label: (<Link to="/admin/products">Thông tin tài khoản</Link>),
        },
        {
            key: `Logout`,
            icon: <i className="fa-solid fa-right-from-bracket"></i>,
            label: (<Link to="/">Đăng xuất</Link>),
        }]

    ////////
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: `Avatar`,
                            label: <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                                <Link to="#">
                                    <Avatar.Group className="">
                                        <Avatar src={user?.user_avatar?.url} />
                                    </Avatar.Group>
                                    <Link to="">{user?.user_fullName}</Link>
                                </Link>
                            </Dropdown>,

                        },
                        {
                            key: `Dashboard`,
                            icon: <WindowsOutlined />,
                            label: (<Link to="/admin">Bảng điều khiển</Link>),
                        },
                        {
                            key: `Products`,
                            icon: <i className="fa-brands fa-product-hunt"></i>,
                            label: 'Sản phẩm',
                            children: [
                                {
                                    key: `Product-list`,
                                    icon: React.createElement(UnorderedListOutlined),
                                    label: (<Link to="/admin/products">Danh sách sản phẩm</Link>),
                                },
                                {
                                    key: `Product-add`,
                                    icon: React.createElement(PlusOutlined),
                                    label: (<Link to="/admin/products/add">Thêm sản phẩm</Link>),
                                }
                            ]
                        },
                        {
                            key: `Categories`,
                            icon: React.createElement(BarsOutlined),
                            label: 'Danh mục',
                            children: [
                                {
                                    key: `Category-list`,
                                    icon: React.createElement(UnorderedListOutlined),
                                    label: (<Link to="/admin/categories">Danh sách danh mục</Link>),
                                },
                                {
                                    key: `Category-add`,
                                    icon: React.createElement(PlusOutlined),
                                    label: (<Link to="/admin/categories/add">Thêm danh mục</Link>),
                                }
                            ]
                        },
                        {
                            key: `Users`,
                            icon: React.createElement(UserOutlined),
                            label: 'Tài khoản',
                            children: [
                                {
                                    key: `Users-list`,
                                    icon: React.createElement(UnorderedListOutlined),
                                    label: (<Link to="/admin/users">Danh sách tài khoản</Link>),
                                },
                                {
                                    key: `Users-add`,
                                    icon: React.createElement(PlusOutlined),
                                    label: (<Link to="/admin/users/add">Thêm tài khoản</Link>),
                                }
                            ]
                        },
                        {
                            key: `Roles`,
                            icon: React.createElement(UserOutlined),
                            label: 'Vai trò',
                            children: [
                                {
                                    key: `Role-list`,
                                    icon: React.createElement(UnorderedListOutlined),
                                    label: (<Link to="/admin/roles">Danh sách vai trò</Link>),
                                },
                                {
                                    key: `Users-add`,
                                    icon: React.createElement(PlusOutlined),
                                    label: (<Link to="/admin/roles/add">Thêm vai trò</Link>),
                                }
                            ]
                        },
                        {
                            key: `Comments`,
                            icon: React.createElement(CommentOutlined),
                            label: (<Link to="/admin/comments">Bình luận</Link>),
                        },
                        {
                            key: `Bills`,
                            icon: React.createElement(ShoppingCartOutlined),
                            label: (<Link to="/admin/bills">Quản lý đơn hàng</Link>),
                        },
                        {
                            key: `statistical`,
                            icon: React.createElement(AreaChartOutlined),
                            label: (<Link to="/admin/statistical">Thống kê</Link>),
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        // background: colorBgContainer,
                    }}
                >
                    <main><Outlet /></main>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout