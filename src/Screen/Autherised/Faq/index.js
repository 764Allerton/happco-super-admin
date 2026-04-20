import React, { useEffect, useState } from 'react'
import { Button, Collapse, Form, Input, Modal, Pagination, Spin } from 'antd';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { CaretDownOutlined } from '@ant-design/icons';
import { itemRender } from 'Utils/UtilityFunctions';
import { useGetFaqDataQuery, useUpdateFaqMutation } from 'Rtk/services/faq';
import DeleteModal from 'Components/DeleteModal';
import LoaderComponent from 'Components/LoaderComponent';
import NoDataFoundComponent from 'Components/NoDataFoundComponent';
import Toast from 'Utils/Toast';

const CommonPagination = ({ pagination, defaultPageSize = 10, handlePaginationChange }) => {
    return (
        <div className='d-flex justify-content-center mt-5'>
            <Pagination current={pagination?.current} total={pagination?.total} defaultPageSize={defaultPageSize} onChange={handlePaginationChange} itemRender={itemRender} showSizeChanger={false} showQuickJumper={false} />
        </div>
    )
}

const FAQ = () => {
    const [form] = Form.useForm();
    const [form_edit] = Form.useForm();
    const [myFAQData, setMyFAQData] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [openAddEditFAQ, setOpenAddEditFAQ] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [updateFaq] = useUpdateFaqMutation();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        position: ['bottomRight'],
    });

    const result = useGetFaqDataQuery({
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        setMyFAQData(result?.data?.data)
    }, [result])

    const handleFaq = async (value) => {
        let payload = {
            question: value?.question,
            answer: value?.answer,
        }
        if (deleteId) {
            payload.Id = deleteId;
        }
        try {
            let result = await updateFaq(payload).unwrap();
            Toast('s', result?.message);
            setDeleteId(null)
            form.resetFields();
            form_edit.resetFields();
            setOpenAddEditFAQ(false)
        } catch (error) {
            setOpenDelete(false)
            if (error?.data?.message) {
                Toast('e', error?.data?.message)
            } else Toast('e', error?.error)
        }
    }

    const handleDelete = async () => {
        let payload = {
            status: 2,
            Id: deleteId
        }
        try {
            let result = await updateFaq(payload).unwrap();
            Toast('s', result?.message);
            setDeleteId(null)
            form.resetFields();
            form_edit.resetFields();
            setOpenDelete(false)
        } catch (error) {
            setOpenDelete(false)
            if (error?.data?.message) {
                Toast('e', error?.data?.message)
            } else Toast('e', error?.error)
        }
    };

    const handlePageChange = (page) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            current: page,
        }));
    };

    return (
        <div className="">
            <div className='contentHeader'>
                <p className={`text-[1rem] font-700 textStyle !text-defaultDarkColor smMin:text-sm`}>FAQ</p>
                <Button className={'commonButton'} onClick={() => { setOpenAddEditFAQ(!openAddEditFAQ) }} >Add FAQ</Button>
            </div>
            <Spin spinning={result?.isLoading} indicator={<LoaderComponent />} >
                <div className='commonBoxShadow bg-white'>
                    <Collapse className='mt-3' accordion defaultActiveKey={['']} expandIcon={({ isActive }) => <CaretDownOutlined rotate={isActive ? -90 : 0} />}>
                        {myFAQData?.length > 0 ?
                            myFAQData?.map((item) => (
                                <Collapse.Panel key={item?._id} header={item?.question} extra={
                                    <div className='flex gap-3'>
                                        <FaEdit className='common_button_edit' onClick={(event) => { setOpenAddEditFAQ(!openAddEditFAQ); setDeleteId(item?._id); form_edit.setFieldsValue({ question: item?.question, answer: item?.answer }); event.stopPropagation(); }} />
                                        <MdDelete className='common_button_edit text-danger' onClick={(event) => { setOpenDelete(true); setDeleteId(item?._id); event.stopPropagation(); }} />
                                    </div>
                                }>
                                    {item?.answer}
                                </Collapse.Panel>
                            ))
                            : <NoDataFoundComponent />
                        }
                    </Collapse>
                </div>
                {
                    myFAQData?.length > 10 &&
                    <div className='text-center'>
                        <CommonPagination pagination={pagination} defaultPageSize={3} handlePaginationChange={handlePageChange} />
                    </div>
                }
            </Spin>
            <Modal
                title={deleteId ?
                    <div className='text-center'>Edit FAQ</div> :
                    <div className='text-center'>Add FAQ</div>
                }
                open={openAddEditFAQ}
                onCancel={() => {
                    form.resetFields();
                    form_edit.resetFields();
                    setOpenAddEditFAQ(!openAddEditFAQ);
                    form_edit.resetFields();
                    setDeleteId(null)
                }}
                footer={null}>
                <Form layout='vertical' className='my-3 w-100' form={deleteId ? form_edit : form} onFinish={handleFaq} >
                    <Form.Item name="question" label="Question" rules={[{ required: true, message: 'Please enter your question!' }]}>
                        <Input placeholder={'Q. Type your question here...?'} className='input__' />
                    </Form.Item>
                    <Form.Item name="answer" label="Answer" rules={[{ required: true, message: 'Please enter your answer!' }]}>
                        <Input.TextArea placeholder={'Type your answer here....'} rows={6} style={{ resize: "none" }} className="commonBoxShadow" />
                    </Form.Item>
                    <Form.Item className='d-flex justify-content-center mt-3 text-center'>
                        <Button className='commonButton ' htmlType={'submit'}>{deleteId ? "Edit" : "Submit"} </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {openDelete && <DeleteModal deleteModalOpen={openDelete} setDeleteModalOpen={setOpenDelete} delType={'FAQ'} deleteCall={handleDelete} />}
        </div>
    )
}

export default FAQ