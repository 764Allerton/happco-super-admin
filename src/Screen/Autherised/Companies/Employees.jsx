
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar, Col, Input, Row } from 'antd';
import { IoMdEye } from 'react-icons/io';
import { fileUrl } from 'Constants/Url';
import { t } from 'i18next';
import { useUpdateUserStatusMutation } from 'Rtk/services/user';
import { Button, Form, Modal } from 'antd';
import { MediaEndpoints } from 'Utils/MediaEndpoints';
import { useGetEmpByTypeQuery, useGetDeptListQuery } from 'Rtk/services/company';
import BreadCrumbComponent from 'Components/BreadCrumbComponent';
import DeleteModal from 'Components/DeleteModal';
import TableComponent from 'Components/TableComponent';
import Toast from 'Utils/Toast';

const Employees = () => {
    const [searchParams] = useSearchParams(); // Initialize useSearchParams
    const id = searchParams.get('id');
    const navigate = useNavigate();
    const location = useLocation();
    const divisionId = location?.state?.divisionId;
    const companyId = location?.state?.companyId;
    const [dataSource, setDataSource] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [updateProfileImgSrc, setUpdateProfileImgSrc] = useState(null);
    const [updateProfileFile, setUpdateProfileFile] = useState(null);
    const [form] = Form.useForm();
    const [openAddModal, setopenAddModal] = useState(false)
    const [userType, setUserType] = useState("");
    const [selectedDeptt, setSelectedDeptt] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
        position: ['bottomRight'],
    })

    useEffect(() => {
        let user_type = "";
        if (id === 'managers') {
            user_type = 1;
        } else if (id === 'directors') {
            user_type = 2;
        } else if (id === 'tl') {
            user_type = 3;
        } else if (id === 'vp') {
            user_type = 4;
        } else if (id === 'ceo') {
            user_type = 5;
        } else if (id === 'employees') {
            user_type = 6;
        } else if (id === 'hr') {
            user_type = 7;
        } else {
            user_type = 10
        }
        setUserType(user_type);
    }, [id]);

    const result = useGetEmpByTypeQuery({ page: pagination?.page, limit: pagination?.pageSize, companyId: companyId, divisionId: divisionId, type: userType, departmentId: selectedDeptt }, {
        refetchOnMountOrArgChange: true, skip: !divisionId || !userType
    });

    const departmentList = useGetDeptListQuery({ divisionId }, {
        refetchOnMountOrArgChange: true,
    })

    const [updateStatus] = useUpdateUserStatusMutation();

    useEffect(() => {
        if (result?.data?.data) {
            setDataSource(result?.data?.data?.results)
            setPagination((prevPagination) => ({
                ...prevPagination,
                total: result?.data?.data?.totalCount
            }));
        }
        if (result?.error?.status == 400) {
            setDataSource([])
            Toast('e', result?.error?.message)
        }
    }, [result, userType])

    const profileReadURL = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setUpdateProfileImgSrc(e.target.result)
            };
            reader.readAsDataURL(event.target.files[0]);
            setUpdateProfileFile(event.target.files[0])
        }
    };

    const handleSubmit = (value) => {
        var data = new FormData();
        data.append("name", value?.name);
        data.append("email", value?.email);
        data.append("department", value?.department);
        data.append("division", value?.division);
        if (updateProfileFile) {
            data.append("medicine_image", updateProfileFile);
        }
    }

    const onCancelModalButton = () => {
        form.resetFields();
        setopenAddModal(!openAddModal);
        setUpdateProfileImgSrc(null);
        setUpdateProfileFile(null);
    }

    const handlePageChange = (page, pageSize) => {
        setDataSource([])
        setPagination((prevPagination) => ({
            ...prevPagination,
            page: page,
            pageSize: pageSize,
        }));
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => <span>{((pagination?.page - 1) * pagination?.pageSize) + (index + 1)}</span>,
            width: 50,
            align: "center"
        },
        {
            title: "profile",
            dataIndex: 'profile_pic',
            key: 'profile_pic',
            render: (profile_pic, record, index) => {
                if (profile_pic) {
                    return <Avatar src={`${fileUrl}${profile_pic}`} className='bg-defaultLightColor' />;
                } else {
                    const initial = record.full_name ? record.full_name.charAt(0).toUpperCase() : '';
                    return <Avatar className='bg-defaultLightColor'>{initial}</Avatar>;
                }
            },
            width: 90,
            align: "center"
        },
        {
            title: 'Name',
            dataIndex: 'full_name',
            key: 'full_name',
            width: 150,
            align: "center",
            render: (text) => text.charAt(0).toUpperCase() + text.slice(1)
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text, _, index) => { return <a key={index} className='text-dark' href={`mailto:${text}`}>{text}</a> },
            width: 220,
            ellipsis: true,
            align: "center"
        },
        {
            title: 'Department',
            dataIndex: 'departmentId',
            key: 'departmentId',
            render: (text) => {
                return text?.name
            },
            width: 150,
            ellipsis: true,
            align: "center"
        },
        {
            title: "Job Title",
            dataIndex: 'job_title',
            key: 'job_title',
            render: (text, _) => { return text },
            width: 130,
            ellipsis: true,
            align: "center"
        },
        {
            title: 'Status',
            dataIndex: 'is_inactive',
            key: 'status',
            render: (text, record) => {
                return record?.is_inactive == true ? "Inactive" : "Active"
            },
            width: 100,
            ellipsis: true,
            align: 'center'
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            key: 'Action',
            width: 100,
            render: (text, record) => {
                return (
                    <div className='flex justify-center gap-3' >
                        <IoMdEye onClick={() => { navigate(`/compemployeedetails?id=${record?._id}&type=${id}&name=${record?.full_name}`) }} className='viewIcon' />
                    </div>
                )
            },
            align: "center",
        },
    ];

    const handleUpdateUser = async (payload) => {
        try {
            let result = await updateStatus(payload).unwrap();
            Toast('s', result?.message);
            setOpenDelete(false)
        } catch (error) {
            setOpenDelete(false)
            if (error?.data?.message) {
                Toast('e', error?.data?.message)
            } else Toast('e', error?.error)
        }
    }

    const handleDelete = async () => {
        const newPage = dataSource?.length === 1 && pagination?.page > 1 ? pagination?.page - 1 : pagination?.page;
        setPagination((prev) => ({
            ...prev,
            page: newPage
        }));
        let payload = {
            status: 2
        }
        handleUpdateUser(payload)
    };

    return (
        <div>
            <Row style={{ display: "flex", justifyContent: "space-between" }}>
                <Col className='mb-4 smMin:flex-col'>
                    <BreadCrumbComponent
                        mainTitle="Home"
                        subtitle="Companies"
                        title={id}
                        className="smMin:mb-2"
                    />
                </Col>
                <Col>
                    <select value={selectedDeptt} onChange={(e) => setSelectedDeptt(e?.target?.value)} className='mr-3 p-1' style={{ border: "1px solid #ccc", borderRadius: 5 }}>
                        <option selected={true} value={""}>Select Department</option>
                        {departmentList?.data?.data?.map((item, index) => (
                            <option key={index} value={item?._id}>{item?.name}</option>
                        ))}
                    </select>
                </Col>
            </Row>
            <TableComponent
                dataSource={result?.data?.data?.results?.length > 0 ? dataSource : []}
                columns={columns}
                loading={result?.isLoading}
                pagination={pagination}
                handlePaginationChange={handlePageChange}
            />
            <Modal
                title={
                    <div className='text-center font-bold'>Add New Manager</div>
                }
                centered
                open={openAddModal}
                onCancel={onCancelModalButton}
                footer={null}>
                <Form layout='vertical' className='my-3 w-100 modalForm' form={form} onFinish={handleSubmit} >
                    <Form.Item className="m-auto py-4" >
                        <div role='button' className='text-center'>
                            <Avatar size={170} id="profileUpdateImg" shape='square' style={{ width: "80px", height: "80px" }} onClick={() => { document.getElementById("updateProfileFile").click() }} src={updateProfileImgSrc && updateProfileImgSrc?.includes('base64') ? `${updateProfileImgSrc}` : MediaEndpoints.uploadImage} />
                            <input accept="image/*" type="file" onChange={profileReadURL} style={{ display: "none" }} id="updateProfileFile" />
                        </div>
                    </Form.Item>
                    <Row className='justify-between my-3'>
                        <Col xs={24} md={24} lg={11} xl={11}>
                            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
                                <Input placeholder={'Name'} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={11} xl={11}>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: 'Please enter email' }]}>
                                <Input placeholder={'email'} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={11} xl={11}>
                            <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please enter department' }]}>
                                <Input placeholder={'department'} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={11} xl={11}>
                            <Form.Item name="division" label="Division" rules={[{ required: true, message: 'Please enter division' }]}>
                                <Input placeholder={'divison'} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className='flex justify-center items-center'>
                        <Form.Item>
                            <Button onClick={() => { form.resetFields(); setopenAddModal(false) }} className={'commonButton bg-gray-600 rounded border-none text-white mr-3 w-[11.5rem] smMin:w-[5rem]'}>Cancel</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type='ghost' className={'commonButton text-white !bg-defaultLightColor rounded w-[11.5rem] smMin:w-[5rem]'} htmlType={'submit'}>Submit</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            {openDelete && <DeleteModal deleteModalOpen={openDelete} setDeleteModalOpen={setOpenDelete} delType={t('users.user')} deleteCall={handleDelete} />}
        </div>
    )
}
export default Employees