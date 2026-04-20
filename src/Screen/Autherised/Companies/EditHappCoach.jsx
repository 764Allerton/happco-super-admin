import { Button, Col, Form, Row } from 'antd'
import BreadCrumbComponent from 'Components/BreadCrumbComponent'
import DeleteModal from 'Components/DeleteModal'
import HappCoachModal from 'Components/HappCoachModal'
import TableComponent from 'Components/TableComponent'
import { t } from 'i18next'
import React, { useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { colorCode } from 'Utils/MediaEndpoints'
import Toast from 'Utils/Toast'

const companydetails = [
    { _id: "1", name: "Solid App Maker", division: "US", employees: "50", clt: [{ name: "Tim", dept: ["Sales", "IT"] }, { name: "Bishnoi", dept: ["Aero Dynamics"] }] },
]

const data = [
    { _id: "1", happcoach: "Tim", department: ["Hr", "Sales"] },
    { _id: "2", happcoach: "Tim", department: ["Hr"] },
    { _id: "3", happcoach: "Tim", department: ["Marketing"] },
    { _id: "4", happcoach: "Tim", department: ["Designing"] },
]

const EditHappCoach = () => {
    const [openDelete, setOpenDelete] = useState(false);
    const [targetedUser, setTargetedUser] = useState(null);
    const [dataSource, setDataSource] = useState(data);
    const [form] = Form.useForm();
    const [addNewHappCoachModal, setAddNewHappCoachModal] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
        position: ['bottomRight'],
    })
    const getAllUsers = ({ page, keyword = null }) => {
        // after 
        // setDataSource("res?.data?.result")
        setPagination((prevPagination) => ({
            ...prevPagination,
            total: 10
        }));
    };
    const handleUpdateUser = async (payload) => {
        try {
            // let result = await updateStatus(payload).unwrap();
            // Toast('s', result?.message);
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
            status: 2,
            user_id: targetedUser?._id
        }
        handleUpdateUser(payload)
    };

    const handlePageChange = (page, pageSize) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            page: page,
            pageSize: pageSize,
        }));
    };


    const handleActionButton = (data) => {
        setOpenDelete(true);
        setTargetedUser(data)
    };

    // Table Columns
    const columns = [
        {
            title: 'HappCoach',
            dataIndex: 'happcoach',
            key: 'happcoach',
            // width: 220,
            ellipsis: true,
            align: "center"
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            // width: 220,
            ellipsis: true,
            align: "center",
            render: (text, record) => (
                <span>{record.department.join(', ')}</span>
            )
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            key: 'Action',
            // width: 200,
            render: (text, record, index) => {
                return (
                    <div className='flex justify-center gap-3' >
                        <MdDelete onClick={() => { handleActionButton(record) }} className='viewIconDel' />
                    </div>
                )
            },
            align: "center",
        },
    ];

    const handleCancel = () => {
        form.resetFields();
        setAddNewHappCoachModal(false)
    };

    const handleSubmit = (values) => {
        form.resetFields();
        setAddNewHappCoachModal(false)
    };

    return (
        <div>
            <div className='flexBetween mb-4 smMin:flex-col'>
                <BreadCrumbComponent
                    mainTitle="Home"
                    title="Happcoaches"
                    className="smMin:mb-2"
                />
            </div>
            <div className='mt-3'>
                <Row className={`flexBetween p-3 bg-[${colorCode.boxBgColor}] rounded-lg`}>
                    <Col>
                        <div className='text-lg font-bold'>
                            Edit HappCoach
                        </div>
                    </Col>
                    <Col>
                        <Button className='border-defaultDarkColor text-defaultDarkColor font-bold py-2' onClick={() => setAddNewHappCoachModal(true)}>
                            Add HappCoach
                        </Button>
                    </Col>
                </Row>
                <div>
                    <Row>
                        <Col sm={24} md={8} lg={6} xl={6} className='p-3 m-0 smMin:w-full'>
                            <div className={`rounded-[15px] shadow bg-[${colorCode.boxBgColor}]`}>
                                <div className='flexCenter rounded-t-[15px] font-bold text-xl mdMin:text-lg pt-10 pb-2'>
                                    Solid App Maker
                                </div>
                                <div className='px-5'>
                                    {companydetails?.map((item) => {
                                        return (
                                            <div className='pl-3 py-3' key={item?._id}>
                                                <div className='my-2'>
                                                    <div className='font-bold'>COMPANY</div>
                                                    <div>{item?.name}</div>
                                                </div>
                                                <div className='my-2'>
                                                    <div className='font-bold'>DIVISION</div>
                                                    <div>{item?.division}</div>
                                                </div>
                                                <div className='my-2'>
                                                    <div className='font-bold'>EMPLOYEES</div>
                                                    <div>{item?.employees}</div>
                                                </div>
                                                <div>
                                                    <div className='font-bold'> CLT</div>
                                                    {
                                                        item?.clt?.map((val, index) => (
                                                            <div key={index} className='my-1 py-1'>
                                                                <div className='font-bold mb-0'>{val?.name}</div>
                                                                <div>{val?.dept.join(', ')}</div>
                                                            </div>
                                                        ))

                                                    }
                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>
                        </Col>
                        <Col sm={24} md={16} lg={18} xl={18} className='p-3 smMin:w-full'>
                            <TableComponent
                                dataSource={dataSource?.length > 0 ? dataSource : []}
                                columns={columns}
                                // loading={result?.isLoading}
                                pagination={pagination}
                                handlePaginationChange={handlePageChange}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
            {addNewHappCoachModal && <HappCoachModal
                visible={addNewHappCoachModal}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
            />}
            {openDelete && <DeleteModal deleteModalOpen={openDelete} setDeleteModalOpen={setOpenDelete} delType={t('users.user')} deleteCall={handleDelete} />}
        </div>
    )
}

export default EditHappCoach