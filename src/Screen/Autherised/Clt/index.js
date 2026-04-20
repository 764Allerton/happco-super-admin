import React, { useEffect, useState } from 'react'
import { Avatar, Col, Input, Popconfirm, Row } from 'antd';
import { fileUrl } from 'Constants/Url';
import { t } from 'i18next';
import { Button, Form, Modal } from 'antd';
import { MediaEndpoints } from 'Utils/MediaEndpoints';
import { useAddCltDetailsMutation, useGetCltDataQuery, useUpdateCltDetailsMutation } from 'Rtk/services/clt';
import { useUploadImageMutation } from 'Rtk/services/common';
import { MdDelete, MdEdit } from 'react-icons/md';
import TableComponent from 'Components/TableComponent';
import BreadCrumbComponent from 'Components/BreadCrumbComponent';
import DeleteModal from 'Components/DeleteModal';
import Toast from 'Utils/Toast';
import SearchComponent from 'Components/SearchComponent';

const Clt = () => {
  const [dataSource, setDataSource] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [updateProfileImgSrc, setUpdateProfileImgSrc] = useState(null);
  const [updateProfileFile, setUpdateProfileFile] = useState(null);
  const [form] = Form.useForm();
  const [openAddModal, setopenAddModal] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [uploadImage] = useUploadImageMutation();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    position: ['bottomRight'],
  })
  const result = useGetCltDataQuery({ page: pagination?.page, limit: pagination?.pageSize, type: "", searchData: searchQuery }, {
    refetchOnMountOrArgChange: true,
  });
  const [addCltDetails] = useAddCltDetailsMutation();
  const [updateCltDetails] = useUpdateCltDetailsMutation();

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

  //  ADD EDIT FUNCTION CALL 
  const handleSubmit = async (value) => {
    var data = new FormData();
    if (updateProfileFile) {
      data.append("file", updateProfileFile);
    }
    try {
      var payload = {
        email: value?.email,
        name: value?.name,
        last_name: value?.last_name,
      }
      if (updateProfileFile) {
        let result = await uploadImage(data).unwrap();
        payload.image = result?.data[0];
      }
      try {
        if (selectedId) payload.Id = selectedId
        const result = selectedId ? await updateCltDetails(payload).unwrap() : await addCltDetails(payload).unwrap();
        Toast('s', result?.message);
        setSelectedId(null)
        setUpdateProfileImgSrc(null)
        setUpdateProfileFile(null)
        form.resetFields();
        setopenAddModal(false);
      } catch (error) {
        if (error?.data?.message) {
          Toast('e', error?.data?.message);
        }
      }
      setopenAddModal(false);
    } catch (error) {
      if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error) 
    }
  }

  const onCancelModalButton = () => {
    form.resetFields();
    setSelectedId(null)
    setopenAddModal(!openAddModal);
    setUpdateProfileImgSrc(null);
    setUpdateProfileFile(null);
    setImageUrl("");
  }

  const handlePageChange = (page, pageSize) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: page,
      pageSize: pageSize,
    }));
  };

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

  const handleEdit = (record) => {
    setSelectedId(record?._id)
    form.setFieldValue('name', record?.first_name)
    form.setFieldValue('last_name', record?.last_name)
    setImageUrl(record?.profile_pic)
    form.setFieldValue('image', record?.profile_pic)
    setopenAddModal(true);
  }

  // Table Columns
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
      title: 'Photo',
      dataIndex: 'profile_pic',
      key: 'profile_pic',
      render: (profile_pic, record, index) => {
        if (profile_pic) {
          return <Avatar src={`${fileUrl}${profile_pic}`}  />;
        } else {
          const initial = record?.first_name ? record?.first_name?.charAt(0).toUpperCase() : '';
          return <Avatar className='bg-defaultLightColor'>{initial}</Avatar>;
        }
      },
      width: 120,
      align: "center"
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      width: 150,
      align: "center",
      render: (text) => text
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      width: 150,
      align: "center",
      render: (text) => text
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
      align: "center",
      render: (email, _) => { return email && email != "" ? email : "--" },
    },
    {
      title: 'Company',
      key: 'clt_company',
      width: 150,
      align: "center",
      render: (text) => (text?.companyId?.name??"N/A")
    },
    {
      title: 'Division',
      key: 'clt_division',
      width: 150,
      align: "center",
      render: (text) => (text?.division?.name??"N/A")
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      width: 130,
      render: (text, record) => {
        return (
          <div className='flex justify-center gap-3' >
            <MdEdit
              onClick={() => handleEdit(record)}
              className='viewIconEdit'
            />
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
      let result = await updateCltDetails(payload).unwrap();
      Toast('s', result?.message);
      setOpenDelete(false)
    } catch (error) {
      setOpenDelete(false)
      if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error) 
    }
  }

  const onChangeSearch = (query) => {
    setSearchQuery(query)
  };

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

  return (
    <div>
      <div className='flexBetween mb-4 smMin:flex-col'>
        <BreadCrumbComponent
          mainTitle="Home"
          title="CLT's"
          className="smMin:mb-2"
        />
        <div className='flex jusitfy-between items-center smMin:flex-col'>
          <SearchComponent placeholder={`Search...`} inlineStyle='w-[200px] !h-[48px]  smMin:my-2  mr-2 smMin:mr-0 border-2 rounded-md !border-defaultDarkColor' onChangeSearch={onChangeSearch} />
          <Button type="ghost" onClick={() => setopenAddModal(true)} className='commonButton w-[200px] smMin:w-[218px] ml-2 smMin:ml-0  h-[3rem]  smMin:h-[30px] min-w-[150px]' >{"Add CLT"}</Button>
        </div>
      </div>
      <TableComponent
        dataSource={dataSource?.length > 0 ? dataSource : []}
        columns={columns}
        loading={result?.isLoading}
        pagination={pagination}
        searchData={searchQuery}
        handlePaginationChange={handlePageChange}
      />

      <Modal title=<div className='text-center font-bold'>CLT Trainers</div> centered open={openAddModal} onCancel={onCancelModalButton} footer={null}>
        <Form layout='vertical' className='my-3 w-100 modalForm' form={form} onFinish={handleSubmit} >
          <Form.Item className="m-auto py-4" name="image">
            <div className='flex items-center justify-center' >
              {(imageUrl && !updateProfileImgSrc) ? (
                <div
                  className='text-center me-4'
                  role='button'
                  tabIndex={0}
                  onClick={() => { document.getElementById("updateProfileFile").click() }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { document.getElementById("updateProfileFile").click(); } }}>
                  <img
                    src={`${fileUrl}${imageUrl}`}
                    alt='img'
                    className='rounded'
                    style={{ width: "80px", height: "80px" }}
                    size={100}
                  />
                </div>
              ) : (
                <div
                  className='text-center'
                  role='button'
                  tabIndex={0}
                  onClick={() => { document.getElementById("updateProfileFile").click() }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { document.getElementById("updateProfileFile").click(); } }}>
                  <Avatar
                    size={170}
                    id="profileUpdateImg"
                    shape='square'
                    style={{ width: "80px", height: "80px" }}
                    src={updateProfileImgSrc?.includes('base64') ? `${updateProfileImgSrc}` : MediaEndpoints.uploadImage}
                  />
                </div>
              )}
            </div>
            <input accept="image/*" type="file" onChange={profileReadURL} style={{ display: "none" }} id="updateProfileFile" />
          </Form.Item>
          <Row className='justify-between my-3'>
            <Col xs={24} md={24} lg={24} xl={24}>
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name', whitespace: true }]}>
                <Input placeholder={'Name'} />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24}>
              <Form.Item name="last_name" label="Last Name" rules={[{ required: false, message: 'Please enter last name', whitespace: true }]}>
                <Input placeholder={'Last Name'} />
              </Form.Item>
            </Col>
            {!selectedId && <Col xs={24} md={24} lg={24} xl={24}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter email' }]}>
                <Input placeholder={'email'} />
              </Form.Item>
            </Col>}
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
export default Clt