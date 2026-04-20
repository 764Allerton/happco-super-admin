/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoMdEye } from 'react-icons/io';
import { t } from 'i18next';
import { MdDelete } from 'react-icons/md';
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select, Switch } from 'antd';
import { useAddCompanyDetailsMutation, useAddCompanyDivisionMutation, useCompanyAddDetailsMutation, useGetCompanyDataQuery, useGetCompanyListQuery, useUpdateCompanyDetailsMutation } from 'Rtk/services/company';
import { useGetHappCoachDataQuery } from 'Rtk/services/happcoach';
import { useGetCltDataQuery } from 'Rtk/services/clt';
import BreadCrumbComponent from 'Components/BreadCrumbComponent';
import DeleteModal from 'Components/DeleteModal';
import SearchComponent from 'Components/SearchComponent';
import TableComponent from 'Components/TableComponent';
import Toast from 'Utils/Toast';

const ComapanyCLT = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();
  const [formAddDivision] = Form.useForm();
  const [formDetails] = Form.useForm();
  const [openAddModal, setopenAddModal] = useState(false)
  const [addDetailsModal, setAddDetailsModal] = useState(false);
  const [openAddDivisionModal, setOpenAddDivisionModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [divisionForAddDetails, setDivisionForAddDetails] = useState(null);
  const [compantList, setCompantList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    position: ['bottomRight'],
  })
  const companyListing = useGetCompanyListQuery({
    refetchOnMountOrArgChange: true,
  });

  const result = useGetCompanyDataQuery({ page: pagination?.page, limit: pagination?.pageSize, searchData: searchQuery }, {
    refetchOnMountOrArgChange: true,
  });

  const resultHappCoach = useGetHappCoachDataQuery({ page: pagination?.page, limit: pagination?.pageSize, type: "" }, {
    refetchOnMountOrArgChange: true,
  });

  const resultClt = useGetCltDataQuery({ page: pagination?.page, limit: pagination?.pageSize, type: "" }, {
    refetchOnMountOrArgChange: true,
  });

  const [addCompanyDetails] = useAddCompanyDetailsMutation();
  const [companyAddDetails] = useCompanyAddDetailsMutation();
  const [addCompanyDivision] = useAddCompanyDivisionMutation();
  const [updateCompanyDetails] = useUpdateCompanyDetailsMutation();

  const happCoachOptions = resultHappCoach?.data?.data?.data?.map(item => ({
    label: item?.name,
    value: item?._id,
  })) || [];

  const cltOptions = resultClt?.data?.data?.data?.map(item => ({
    label: item?.name,
    value: item?._id,
  })) || [];

  const onChangeSearch = (query) => {
    setSearchQuery(query)
  };

  useEffect(() => {
    if (companyListing?.data?.data?.data) {
      setCompantList(companyListing?.data?.data?.data)
    }
  }, [companyListing?.data?.data?.data])

  useEffect(() => {
    if (result?.data?.data?.data) {
      setDataSource(result?.data?.data?.data)
      setPagination((prevPagination) => ({
        ...prevPagination,
        total: result?.data?.data?.totalCount
      }));
    }
    if (result?.error?.status == 400) {
      setDataSource(result?.error?.data)
      setPagination((prevPagination) => ({
        ...prevPagination,
        total: 0
      }));
    }
  }, [result?.data?.data?.data, result])

  const handlePageChange = (page, pageSize) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: page,
      pageSize: pageSize,
    }));
  };

  const addDetailsButtonClick = (record) => {
    navigate('/managecomp', { state: { record: record } })
  }

  const handleDeleteButton = (record) => {
    const newPage = dataSource?.length === 1 && pagination?.page > 1 ? pagination?.page - 1 : pagination?.page;
    setPagination((prev) => ({
      ...prev,
      page: newPage
    }));
    let payload = {
      status: "2",
      Id: record?._id
    }
    handleUpdateUser(payload)
  };

  const onStatusChange = (event, record) => {
    const status = event == true ? "1" : "0"
    let payload = {
      status: status,
      Id: record?._id
    }
    handleUpdateUser(payload)
  }

  // Table Columns
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => <span>{((pagination?.page - 1) * pagination?.pageSize) + (index + 1)}</span>,
      width: 50,
      align: "center"
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      width: 220,
      ellipsis: true,
      align: 'center',
      render: (t, record) => `${record?.name ?? '--'} - ${record?.divisions?.name ?? '-'}`
    },
    {
      title: 'Department',
      key: 'department',
      render: (text, record) => {
        return record?.departmentsData?.map((deptt) => (deptt?.name + ", "))
      },
      width: 220,
      ellipsis: true,
      align: 'center'
    },
    {
      title: "HappCoaches",
      dataIndex: 'happcoaches',
      key: 'happcoaches',
      render: (arr, record, index) => {
        const divisionCheck = record?.divisions?._id ? true : false;
        const hpCoachCheck = record?.divisions?.happ_coach_details?.length > 0 ? true : false;
        let hpCoach, rtn;
        if (!hpCoachCheck) {
          hpCoach = []
        } else {
          hpCoach = record?.divisions?.happ_coach_details?.map(detail => (detail.first_name + " " + detail?.last_name)).join(', ')
        }
        rtn = hpCoachCheck ? hpCoach : "--";
        return rtn;
      },
      width: 220,
      ellipsis: true,
      align: "center"
    },
    {
      title: 'Employees',
      dataIndex: 'no_of_employee',
      key: 'no_of_employee',
      render: (text, record, index) => {
        const emp = record?.divisions?.employee_count
        return emp ? emp : "--"
      },
      width: 100,
      ellipsis: true,
      align: "center"
    },

    {
      title: "Status",
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const st = record?.status == '1' ? true : false;
        const statusChange = (event) => {
          onStatusChange(event, record)
        }
        return <Switch onChange={statusChange} defaultValue={st} />
      },
      width: 90,
      ellipsis: true,
      align: "center"
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      width: 300,
      render: (text, record) => {
        return (
          <div className='flex justify-center gap-3' >
            <Button onClick={() => (addDetailsButtonClick(record))}>Manage Company</Button>
            <IoMdEye onClick={() => { navigate(`/companydetails?id=${record?._id}`, { state: { record: record } }) }} className='viewIcon' />
            <Popconfirm
              title="Are you sure you want to delete this record?"
              onConfirm={() => handleDeleteButton(record)}
              okText="Yes"
              cancelText="No">
              <MdDelete className='viewIconDel' />
            </Popconfirm>
          </div>
        )
      },
      align: "center",
    },
  ];

  const handleUpdateUser = async (payload) => {
    try {
      let result = await updateCompanyDetails(payload).unwrap();
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
      status: 2,
    }
    handleUpdateUser(payload)
  };

  const handleCancel = () => {
    setAddDetailsModal(false)
    formDetails.resetFields()
    form.resetFields()
  };

  // add company details 
  const handleSubmit = async (values) => {
    let payload = {
      employee: values?.employee,
      cltId: JSON.stringify(values?.clt),
      happcoachId: JSON.stringify(values?.happcoach),
      companyId: values?.id,
      divisionId: divisionForAddDetails
    }
    try {
      const result = await addCompanyDetails(payload).unwrap();
      setAddDetailsModal(false);
      setDivisionForAddDetails(null)
      Toast('s', result?.message);
      formDetails.resetFields();
    } catch (error) {
      if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error)
    }
  };

  const onCancelModalButton = () => {
    form.resetFields();
    formAddDivision.resetFields();
    setopenAddModal(false);
    setOpenAddDivisionModal(false);
  }

  const handleSubmitAddCompany = async (value) => {
    let payload = {
      name: value?.name,
    }
    try {
      const result = await companyAddDetails(payload).unwrap();
      Toast('s', result?.message);
      form.resetFields();
      setopenAddModal(false);
    } catch (error) {
      if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error)
    }
  }

  const handleSubmitAddDivision = async (value) => {
    let payload = {
      name: value?.division,
      companyId: value?.company,
      email: value?.email
    }
    try {
      const result = await addCompanyDivision(payload).unwrap();
      Toast('s', result?.message);
      form.resetFields();
      setOpenAddDivisionModal(false);
    } catch (error) {
      if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error)
    }
  }

  const onChangeCompType = (value) => {
    setSelectedCompany(value)
  }

  return (
    <div>
      <div className='flexBetween mb-4 smMin:flex-col'>
        <BreadCrumbComponent
          mainTitle="Home"
          title="Companies" // or any title relevant to your current page
          className="smMin:mb-2"
        />
        <div className='flex jusitfy-between items-center smMin:flex-col'>
          <SearchComponent placeholder={`Search...`} inlineStyle='w-[200px] !h-[48px]  smMin:my-2  mr-2 smMin:mr-0 border-2 rounded-md !border-defaultDarkColor' onChangeSearch={onChangeSearch} />
          <Button type="ghost" onClick={() => setOpenAddDivisionModal(true)} className='commonButton w-[200px] smMin:w-[218px] ml-2 smMin:ml-0  h-[3rem]  smMin:h-[30px] min-w-[150px] smMin:mb-2' >{"Add Division"}</Button>
          <Button type="ghost" onClick={() => setopenAddModal(true)} className='commonButton w-[200px] smMin:w-[218px] ml-2 smMin:ml-0  h-[3rem]  smMin:h-[30px] min-w-[150px]' >{"Add New Company"}</Button>
        </div>
      </div>

      <TableComponent
        dataSource={dataSource?.length > 0 ? dataSource : []}
        columns={columns}
        loading={result?.isLoading}
        pagination={pagination}
        handlePaginationChange={handlePageChange}
        searchData={searchQuery}
      />
      {openDelete && <DeleteModal deleteModalOpen={openDelete} setDeleteModalOpen={setOpenDelete} delType={t('users.user')} deleteCall={handleDelete} />}

      {/* add company details */}
      <Modal
        title={<div className='text-center font-bold'>Manage Company Details</div>}
        centered
        open={addDetailsModal}
        onCancel={handleCancel}
        footer={null}>
        <Form
          layout='vertical'
          className='my-3 w-100 modalForm'
          form={formDetails}
          onFinish={handleSubmit}>
          <Form.Item name={"id"}></Form.Item>
          <Row className='justify-between my-3'>
            <Col xs={24} md={24} lg={11} xl={11}>
              <Form.Item
                name="name"
                label="Company Name"
                rules={[{ required: true, message: 'Please enter name' }]}
                disabled>
                <Input placeholder='Name' />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={11} xl={11}>
              <Form.Item
                name="employee"
                label="Number of Employess"
                rules={[{ required: true, type: Number, message: 'Please enter employee' }]}>
                <Input placeholder='Employee' />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={11} xl={11}>
              <Form.Item
                name="clt"
                label="CLT"
                rules={[{ required: true, message: 'Add clt' }]}>
                <Select
                  mode="tags"
                  placeholder="Add clt"
                  options={cltOptions} // Use the mapped options
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={11} xl={11}>
              <Form.Item
                name="happcoach"
                label="Happcoach"
                rules={[{ required: true, message: 'Please select Happcoach' }]}
              >
                <Select
                  mode="tags"
                  placeholder="Select Happcoach"
                  options={happCoachOptions} // Use the mapped options
                />
              </Form.Item>
            </Col>
          </Row>
          <div className='flex justify-center items-center'>
            <Form.Item>
              <Button
                onClick={handleCancel}
                className='commonButton bg-gray-600 rounded border-none text-white mr-3 w-[11.5rem] smMin:w-[5rem]'
              >
                Cancel
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type='ghost'
                className='commonButton text-white !bg-defaultLightColor rounded w-[11.5rem] smMin:w-[5rem]'
                htmlType='submit'>
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* ADD Company Modal */}
      <Modal
        title={
          <div className='text-center font-bold'>Add New Company</div>
        }
        centered open={openAddModal}
        onCancel={onCancelModalButton}
        footer={null}
      >
        <Form layout='vertical' className='my-3 w-100 modalForm' form={form} onFinish={handleSubmitAddCompany} >
          <Row className='justify-between my-3'>
            <Col xs={24} md={24} lg={24} xl={24}>
              <Form.Item name="name" label="Comapny Name" rules={[{ required: true, message: 'Please enter company name', whitespace: true }]}>
                <Input placeholder={'Company Name'} />
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

      {/* add division modal */}
      <Modal 
        title={
          <div className='text-center font-bold'>Add Division</div>
        } 
        centered 
        open={openAddDivisionModal} 
        onCancel={onCancelModalButton} 
        footer={null}
      >
        <Form layout='vertical' className='my-3 w-100 modalForm' form={formAddDivision} onFinish={handleSubmitAddDivision} >
          <Row className='justify-between my-3'>
            <Col xs={24} md={24} lg={24} xl={24}>
              <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Please select company' }]}>
                <Select
                  placeholder="Select Company"
                  onChange={onChangeCompType} // Trigger API call on type change
                  className='mr-2 smMin:mr-0 w-[200px] !h-[40px] smMin:w-[150px]'
                  value={selectedCompany}
                  allowClear
                  options={compantList?.map((company) => ({
                    label: company?.name,
                    value: company._id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24}>
              <Form.Item name="division" label="Division" rules={[{ required: true, message: 'Please enter division', whitespace: true }]}>
                <Input placeholder={'divison'} className='!h-[40px]' />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24}>
              <Form.Item name="email" label="Contact Person Email" rules={[{ required: true, message: 'Please enter email', whitespace: true, type: "email" }]}>
                <Input placeholder={'Email'} className='!h-[40px]' />
              </Form.Item>
            </Col>
          </Row>
          <div className='flex justify-center items-center'>
            <Form.Item>
              <Button onClick={() => { formAddDivision.resetFields(); setOpenAddDivisionModal(false) }} className={'commonButton bg-gray-600 rounded border-none text-white mr-3 w-[11.5rem] smMin:w-[5rem]'}>Cancel</Button>
            </Form.Item>
            <Form.Item>
              <Button type='ghost' className={'commonButton text-white !bg-defaultLightColor rounded w-[11.5rem] smMin:w-[5rem]'} htmlType={'submit'}>Submit</Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
export default ComapanyCLT