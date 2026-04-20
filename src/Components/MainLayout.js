import { Avatar, Button, Drawer, Dropdown, Image, Layout, Menu, Modal, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MdDashboard, MdBusiness, MdGroup, MdAssignment, MdSettings, MdMessage } from "react-icons/md";
import { t } from 'i18next';

/* Icons */
import { CgProfile } from 'react-icons/cg';
import { MenuOutlined } from '@ant-design/icons';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoIosArrowDown } from 'react-icons/io';
import { LoginOutlined } from "@ant-design/icons";
import { MediaEndpoints } from 'Utils/MediaEndpoints';
import { useDispatch, useSelector } from 'react-redux';
import { fileUrl } from 'Constants/Url';
import { clearAuthData } from 'Rtk/slices/auth/authSlice';
const { Header, Sider, Content } = Layout;
import ThemeSelect from './ThemeSelect';

const MainLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation(); // Get the current path
    const [open, setOpen] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);
    const [selectedKey, setSelectedKey] = useState('');
    var themeMode = localStorage.getItem("theme");
    const userData = useSelector(state => state?.auth?.adminData)

    const staticSideList = [
        {
            title: 'Dashboard',
            link: '/dashboard',
            icons: <MdDashboard className={selectedKey === 'dashboard' ? 'sideIconSelect' : 'sideIcon'} />,
            key: 'dashboard'
        },
        {
            title: "Company",
            link: '/company',
            icons: <MdBusiness className={selectedKey === 'company' ? 'sideIconSelect' : 'sideIcon'} />,
            key: 'company'
        },
        {
            title: "CLT",
            link: '/clt',
            icons: <MdGroup className={selectedKey === 'clt' ? 'sideIconSelect' : 'sideIcon'} />,
            key: 'clt'
        },
        {
            title: "Actions",
            link: '/hc',
            icons: <MdGroup className={selectedKey === 'hc' ? 'sideIconSelect' : 'sideIcon'} />,
            key: 'hc'
        },
        {
            title: "HappCoaches",
            link: '/happcoaches',
            icons: <MdAssignment className={selectedKey === 'happcoaches' ? 'sideIconSelect' : 'sideIcon'} />,
            key: 'happcoaches'
        },
        {
            title: "FAQ",
            link: '/faq',
            icons: <MdAssignment className={selectedKey === 'faq' ? 'sideIconSelect' : 'sideIcon'} />,
            key: 'faq'
        },
        {
            title: 'Messages',
            link: '/messages',
            icons: (
              <MdMessage
                className={selectedKey == 'messages' ? 'sideIconSelect' : `sideIcon`}
              />
            ),
            key: 'messages'
          },
        {
            title: "Settings",
            link: '/settings',
            icons: <MdSettings className={selectedKey === 'settings' ? 'sideIconSelect' : 'sideIcon'} />,
            key: 'settings'
        },
    ];

    useEffect(() => {
        // Determine the selected key based on the current path
        const currentPath = location.pathname.split('/')[1]; // Extract the first part of the path
        const matchedItem = staticSideList.find(item => item.link.includes(currentPath));
        if (matchedItem) {
            setSelectedKey(matchedItem.key);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        dispatch(clearAuthData());
        navigate('/', { replace: true });
    };

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    const staticAdminSidebarList = staticSideList;

    const onClick = ({ key }) => {
        if (key === "logoutKey") {
            setLogoutModal(true);
        } else {
            navigate("/profile");
        }
    };

    const items = [
        {
            label: 'Profile', icon: <CgProfile style={{ fontSize: "1rem" }} />,
            key: 'profile',
        },
        {
            label: "Logout", icon: <LoginOutlined style={{ fontSize: "1rem" }} />,
            key: 'logoutKey',
        },
    ];

    return (
        <Layout className='h-screen'>
            <Header className={`headerStyle`} >
                <div className='mt-[10px] flex justify-between items-center h-[64px]'>
                    <div className='logoHeader'>
                        <Image preview={false} src={MediaEndpoints.logo} role='button' onClick={() => navigate("/dashboard")} />
                    </div>
                    <div className={"lgScreen"}>
                        <div role='button' className='avtar'>
                            <Dropdown menu={{ items, onClick }} trigger={['click']} placement='bottomCenter'>
                                <button onClick={(e) => { e.preventDefault(); }} className='no-underline cursor-pointer bg-transparent'>
                                    <Space>
                                        {userData?.profile_pic == '' ? (
                                            <Avatar>A</Avatar>
                                        ) : (
                                            <Avatar className='cursor-pointer w-[30px] h-[26px]' size={34} src={`${fileUrl}${userData?.profile_pic}`} />
                                        )}
                                        <div>
                                            {userData?.name ?? 'Admin'}
                                        </div>
                                        <IoIosArrowDown className='text-defaultDarkColor' />
                                    </Space>
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                    <div role="button" tabIndex="0" onClick={() => setOpen(!open)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setOpen(!open); } }} className={`menuIcons  ${themeMode === 'dark' ? 'dark' : 'light'}`}>
                        <MenuOutlined />
                    </div>
                </div>
            </Header>
            <Layout hasSider>
                <Sider trigger collapsible className="customSiderWidth shadow-md max-h-screen overflow-y-auto">
                    <div className={`slider flex flex-col justify-between h-full relative  `}>
                        <Menu theme={themeMode} mode="inline" selectable selectedKeys={[selectedKey]} onClick={handleMenuClick} defaultSelectedKeys={['dashboard']}>
                            {staticSideList?.map((item) => (
                                <Menu.Item key={item?.key} onClick={() => navigate(`${item?.link}`)} className={` ${selectedKey === item?.key ? "selectedMenuC" : ""} flex justify-between w-full`} >
                                    <span className="flex items-center w-full">
                                        <span className="rounded-full p-2 min-w-[35px]">{item?.icons}</span>&nbsp;
                                        <span className={selectedKey === item?.key ? "text-white" : ""}>{item?.title}</span>
                                    </span>
                                </Menu.Item>
                            ))}
                        </Menu>
                        <div className='absolute -bottom-9 z-[9999] left-10 flex gap-3 switchTheme'><ThemeSelect /></div>
                    </div>
                </Sider>
                <Content theme={themeMode} className={`content`}>
                    <Outlet />
                </Content>
            </Layout>
            {/* Md/Tablet  */}
            <Drawer placement="right" onClose={() => setOpen(!open)} open={open}>
                <div>
                    {staticAdminSidebarList?.map((item, index) => {
                        const selectedItem = item?.key;
                        return (
                            <div
                                key={index}
                                role="button"
                                tabIndex="0"
                                onClick={() => {
                                    navigate(`${item?.link}`);
                                    setOpen(!open);
                                    setSelectedKey(selectedItem);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        navigate(`${item?.link}`);
                                        setOpen(!open);
                                    }
                                }}
                                className={`my-2 p-2 rounded-lg cursor-pointer ${selectedItem === selectedKey ? 'drwSelected' : ''}`}
                            >
                                <span className="flex items-center">
                                    <span className="me-2">{item?.icons}</span>&nbsp;
                                    <span>{item?.title}</span>
                                </span>
                            </div>
                        );
                    })}
                    <div className='my-4  flex gap-3 switchTheme'><ThemeSelect /></div>
                    <div>
                        <Button onClick={() => { setOpen(!open); handleLogout(); }} tabIndex="0" className="flex my-2 p-2 rounded-lg cursor-pointer border-none">
                            <RiLogoutBoxRLine className='text-lg' />
                            <span className="mx-2">{t('dashboard.logout')}</span>
                        </Button>
                    </div>
                </div>
            </Drawer>
            <Modal open={logoutModal} footer={null} closable={false} >
                <div className='text-center p-3'>
                    <p className='text-xl font-700'>Are you sure want to logout?</p>
                    <div className='flex gap-3 justify-center'>
                        <Button type='ghost' className={'authButton bg-red-800 w-[8rem]'} onClick={() => setLogoutModal(false)} >Cancel</Button>
                        <Button type='ghost' className={'authButton w-[8rem]'} onClick={() => handleLogout()}>Yes</Button>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default MainLayout;
