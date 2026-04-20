import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Col, Input, Popconfirm, Row } from 'antd'
import { IoMdEye } from 'react-icons/io'
import { fileUrl } from 'Constants/Url'
import { Button, Form, Modal } from 'antd'
import { useAddHappCoachDetailsMutation, useGetHappCoachDataQuery, useUpdateHappCoachDetailsMutation } from 'Rtk/services/happcoach'
import { MdDelete, MdEdit } from 'react-icons/md'
import BreadCrumbComponent from 'Components/BreadCrumbComponent'
import TableComponent from 'Components/TableComponent'
import Toast from 'Utils/Toast'
import SearchComponent from 'Components/SearchComponent'

const HappCoaches = () => {
  const navigate = useNavigate()
  const [dataSource, setDataSource] = useState([])
  const [form] = Form.useForm()
  const [searchQuery, setSearchQuery] = useState('')
  const [openAddModal, setopenAddModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    position: ['bottomRight']
  })

  const result = useGetHappCoachDataQuery({ page: pagination?.page, limit: pagination?.pageSize, type: '', searchData: searchQuery }, {
    refetchOnMountOrArgChange: true
  })

  const [addHappCoachDetails] = useAddHappCoachDetailsMutation()
  const [updateHappCoachDetails] = useUpdateHappCoachDetailsMutation()

  useEffect(() => {
    if (result?.data?.data?.data) {
      setDataSource(result?.data?.data?.data)
      setPagination(prevPagination => ({
        ...prevPagination,
        total: result?.data?.data?.totalCount
      }))
    }
    if (result?.error?.status == 400) {
      setDataSource(result?.error?.data)
      setPagination(prevPagination => ({
        ...prevPagination,
        total: 0
      }))
    }
  }, [result?.data?.data?.data, result])

  const onCancelModalButton = () => {
    form.resetFields()
    setopenAddModal(!openAddModal)
  }

  /* Triggered on Change Page Number */
  const handlePageChange = (page, pageSize) => {
    setPagination(prevPagination => ({
      ...prevPagination,
      page: page,
      pageSize: pageSize
    }))
  }

  const handleEdit = record => {
    setSelectedId(record?._id)
    form.setFieldValue('name', record?.full_name)
    form.setFieldValue('last_name', record?.last_name)
    form.setFieldValue('email', record?.email)
    setopenAddModal(true)
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => (
        <span>
          {(pagination?.page - 1) * pagination?.pageSize + (index + 1)}
        </span>
      ),
      width: 50,
      align: 'center'
    },
    {
      title: 'Photo',
      dataIndex: 'profile_pic',
      key: 'profile_pic',
      render: (profile_pic, record) => {
        if (profile_pic) {
          return (
            <Avatar
              src={`${fileUrl}${profile_pic}`}
              className='bg-defaultLightColor'
            />
          )
        } else {
          const initial = record.full_name
            ? record.full_name.charAt(0).toUpperCase()
            : ''
          return <Avatar className='bg-defaultLightColor'>{initial}</Avatar>
        }
      },
      width: 120,
      align: 'center'
    },
    {
      title: 'HappCoach',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 220,
      ellipsis: true,
      align: 'center',
      render: text => text?.charAt(0).toUpperCase() + text?.slice(1)
    },
    {
      title: 'Email',
      key: 'email',
      render: (text, _, index) => { return <div> {text ? <a key={index} className='text-dark' href={`mailto:${text?.email}`}>{text?.email}</a> : "--"}</div> },
      width: 220,
      ellipsis: true,
      align: "center"
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      width: 220,
      ellipsis: true,
      align: 'center',
      render: (t, record) => `${record?.companyId?.name ?? '--'} - ${record?.division?.name ?? '-'}`
    },
    {
      title: 'Department',
      key: 'department',
      render: (text, record) => {
        return record?.happcoachDepartment?.map((deptt) => (deptt?.name+", "))
      },
      width: 220,
      ellipsis: true,
      align: 'center'
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      width: 200,
      render: (text, record) => {
        return (
          <div className='flex justify-center gap-3'>
            <IoMdEye
              onClick={() => {
                navigate(`/happcoachcompdetails?id=${record?._id}`)
              }}
              className='viewIcon'
            />
            <MdEdit
              onClick={() => handleEdit(record)}
              className='viewIconEdit'
            />
            <Popconfirm
              title='Are you sure you want to delete this record?'
              onConfirm={() => handleDeleteButton(record)}
              okText='Yes'
              cancelText='No'>
              <MdDelete className='viewIconDel' />
            </Popconfirm>
          </div>
        )
      },
      align: 'center'
    }
  ]

  const handleUpdateUser = async payload => {
    try {
      let result = await updateHappCoachDetails(payload).unwrap()
      Toast('s', result?.message)
    } catch (error) {
      if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error)
    }
  }

  const onChangeSearch = query => {
    setSearchQuery(query)
  }

  const handleSubmitAddCompany = async value => {
    try {
      var payload = {
        name: value?.name,
        last_name: value?.last_name,
        email: value?.email
      }
      if (selectedId) payload.Id = selectedId
      const result = selectedId
        ? await updateHappCoachDetails(payload).unwrap()
        : await addHappCoachDetails(payload).unwrap()
      Toast('s', result?.message)
      setSelectedId(null)
      form.resetFields()
      setopenAddModal(false)
    } catch (error) {
      if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error)
    }
  }

  const handleDeleteButton = record => {
    const newPage =
      dataSource?.length === 1 && pagination?.page > 1
        ? pagination?.page - 1
        : pagination?.page
    setPagination(prev => ({
      ...prev,
      page: newPage
    }))
    let payload = {
      status: '2',
      Id: record?._id
    }
    handleUpdateUser(payload)
  }

  return (
    <div>
      <div className='flexBetween mb-4 smMin:flex-col'>
        <BreadCrumbComponent
          mainTitle='Home'
          title='Happcoaches'
          className='smMin:mb-2'
        />
        <div className='flex jusitfy-between items-center smMin:flex-col'>
          <SearchComponent
            placeholder={`Search...`}
            inlineStyle='w-[200px] !h-[48px]  smMin:my-2  mr-2 smMin:mr-0 border-2 rounded-md !border-defaultDarkColor'
            onChangeSearch={onChangeSearch}
          />
          <Button
            type='ghost'
            onClick={() => {
              setSelectedId(null)
              setopenAddModal(true)
            }}
            className='commonButton w-[200px] smMin:w-[218px] ml-2 smMin:ml-0  h-[3rem]  smMin:h-[30px] min-w-[150px]'>
            {'Add New HappCoach'}
          </Button>
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
      <Modal
        title={<div className='text-center font-bold'>
          {selectedId ? 'Edit HappCoach' : 'Add New HappCoach'}{' '}
        </div>}
        centered
        open={openAddModal}
        onCancel={onCancelModalButton}
        footer={null}>
        <Form
          layout='vertical'
          className='my-3 w-100 modalForm'
          form={form}
          onFinish={handleSubmitAddCompany}>
          <Row className='justify-between my-3'>
            <Col xs={24} md={24} lg={24} xl={24}>
              <Form.Item
                name='name'
                label='First Name'
                rules={[
                  {
                    required: true,
                    message: 'Please Enter First Name',
                    whitespace: true
                  }
                ]}>
                <Input placeholder={'First Name'} />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24}>
              <Form.Item
                name='last_name'
                label='Last Name'
                rules={[
                  {
                    required: false,
                    message: 'Please Enter Last Name',
                    whitespace: true
                  }
                ]}>
                <Input placeholder={'Last Name'} />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24}>
              <Form.Item
                name='email'
                label='Email'
                rules={[
                  {
                    type: 'email',
                    required: true,
                    message: 'Add Correct Email',
                    whitespace: true
                  }
                ]}>
                <Input placeholder={'Email'} />
              </Form.Item>
            </Col>
          </Row>
          <div className='flex justify-center items-center'>
            <Form.Item>
              <Button
                onClick={onCancelModalButton}
                className={
                  'commonButton bg-gray-600 rounded border-none text-white mr-3 w-[11.5rem] smMin:w-[5rem]'
                }>
                Cancel
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type='ghost'
                className={
                  'commonButton text-white !bg-defaultLightColor rounded w-[11.5rem] smMin:w-[5rem]'
                }
                htmlType={'submit'}>
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
export default HappCoaches