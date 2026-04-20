import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IoMdEye } from 'react-icons/io'
import { fileUrl } from 'Constants/Url'
import { useAssignedMemberListingQuery } from 'Rtk/services/user'
import { useGetCompanyListQuery, useGetDeptListQuery } from 'Rtk/services/company'
import { Button, Dropdown, Menu, Avatar, Col, Row } from 'antd'
import { DownOutlined } from "@ant-design/icons";
import BreadCrumbComponent from 'Components/BreadCrumbComponent'
import TableComponent from 'Components/TableComponent'

const AssignedListing = () => {
  const navigate = useNavigate()
  const [dataSource, setDataSource] = useState([])
  const [roleFilter, setRoleFilter] = useState("Select Role");
  const [roleFilterCode, setRoleFilterCode] = useState("");
  const [companies, setCompanies] = useState([]);
  const [divisionId, setDivisionId] = useState("");
  const [selectedDeptt, setSelectedDeptt] = useState("");
  const [divisionName, setDivisionName] = useState("All Companies");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    position: ['bottomRight']
  })

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const result = useAssignedMemberListingQuery({ page: pagination?.page, limit: pagination?.pageSize, userId: id, role: roleFilterCode, divisionId, departmentId: selectedDeptt }, {
    refetchOnMountOrArgChange: true
  })

  const companyResult = useGetCompanyListQuery({ page: 1, limit: 100, searchData: "" }, {
    refetchOnMountOrArgChange: true
  })

  const departmentList = useGetDeptListQuery({ divisionId }, {
    refetchOnMountOrArgChange: true,
  })

  const handleRoleClick = ({ key }) => {
    let temp;
    switch (key) {
      case "Manager":
        temp = "1"
        break;
      case "BOD":
        temp = "2"
        break;
      case "Team Lead":
        temp = "3"
        break;
      case "VP":
        temp = "4"
        break;
      case "CEO":
        temp = "5"
        break;
      case "Employee":
        temp = "6"
        break;
      default:
        temp = ""
    }
    setRoleFilter(key);
    setRoleFilterCode(temp);
    localStorage.setItem('filter', JSON.stringify({filterKey: key, filtercode: temp}))
  };

  useEffect(() => {
    if (result?.data?.data?.users) {
      setDataSource(result?.data?.data?.users)
      setPagination(prevPagination => ({
        ...prevPagination,
        total: result?.data?.data?.totalCount
      }))
    } else if (result?.error?.status == 400) {
      setDataSource([])
      setPagination(prevPagination => ({
        ...prevPagination,
        total: 0
      }))
    }
  }, [result?.data, result])

  useEffect(() => {
    let filter = localStorage.getItem('filter')
    if(filter){
      let temp = JSON.parse(filter)
      setRoleFilter(temp?.filterKey)
      setRoleFilterCode(temp.filtercode)
    }
  },[])

  useEffect(() => {
    if (companyResult?.isSuccess) {
      const companiesData = []
      companyResult?.data?.data?.data?.map((comp) => {
        comp?.divisions?.map((div) => {
          companiesData.push({
            name: `${comp?.name} - ${div?.name}`,
            divId: div?._id
          })
        })
      })
      setCompanies(companiesData)
    } else {
      setCompanies([])
    }
  }, [companyResult?.data, companyResult])

  /* Triggered on Change Page Number */
  const handlePageChange = (page, pageSize) => {
    setPagination(prevPagination => ({
      ...prevPagination,
      page: page,
      pageSize: pageSize
    }))
  }

  // Table Columns
  const columns = [
    {
      title: '#',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => (
        <span>{10 * (pagination?.page - 1) + (index + 1)}</span>
      ),
      width: 50,
      align: 'center'
    },
    {
      title: 'Photo',
      dataIndex: 'profile_pic',
      key: 'profile_pic',
      render: (profile_pic, record) => {
        if (record?.profile_pic) {
          return (
            <Avatar
              src={`${fileUrl}${record?.profile_pic}`}
              className='bg-defaultLightColor'
            />
          )
        } else {
          const initial = record.full_name
            ? record.full_name?.charAt(0).toUpperCase()
            : ''
          return <Avatar className='bg-defaultLightColor'>{initial}</Avatar>
        }
      },
      width: 120,
      align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 150,
      align: 'center'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      ellipsis: true,
      align: 'center'
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
        return record?.departmentId?.name
      },
      width: 220,
      ellipsis: true,
      align: 'center'
    },
    {
      title: 'Status',
      dataIndex: 'is_inactive',
      key: 'status',
      render: (text, record) => {
        return record?.is_inactive==true?"Inactive" : "Active"
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
          <div className='flex justify-center gap-3'>
            <IoMdEye
              onClick={() => {
                navigate(`/assignedactions?id=${record?._id}`, {
                  state: record
                })
              }}
              className='viewIcon'
            />
          </div>
        )
      },
      align: 'center'
    }
  ]

  const handleCompanyClick = (e) => {
    setDivisionId(e.target.value)
    setDivisionName(e.target.options[e.target.selectedIndex].text)
    if(e.target.value == "") {  
      setSelectedDeptt("")
    }
  }

  const roleMenu = (
    <Menu onClick={handleRoleClick}>
      <Menu.Item key="Select Role">Select Role</Menu.Item>
      <Menu.Item key="Employee">Employee</Menu.Item>
      <Menu.Item key="Team Lead">Team Lead</Menu.Item>
      <Menu.Item key="Manager">Manager</Menu.Item>
      <Menu.Item key="VP">VP</Menu.Item>
      <Menu.Item key="CEO">CEO</Menu.Item>
      <Menu.Item key="BOD">BOD</Menu.Item>
    </Menu>
  );

  const companyMenu = (
    <select style={{ border: "1px solid #ccc", padding: 5, borderRadius: 5 }} onChange={(e) => handleCompanyClick(e)}>
      <option value="">All Companies</option>
      {companies?.map((company, index) => (
        <option key={index} value={company?.divId}>{company?.name}</option>
      ))}
    </select>
  );

  return (
    <div>
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        <Col className='mb-4 smMin:flex-col'>
          <BreadCrumbComponent
            mainTitle={`Home / ${divisionName}`}
            title='Assigned Members'
            className='smMin:mb-2'
          />
        </Col>
        <Col className='mr-3'>
          {companyMenu}
        </Col>
        {divisionId != "" &&
        <Col>
          <select value={selectedDeptt} onChange={(e) => setSelectedDeptt(e?.target?.value)} className='mr-3 p-1' style={{border: "1px solid #ccc", borderRadius: 5}}>
            <option selected={true} value={""}>Select Department</option>
              {departmentList?.data?.data?.filter((f) => f?.name != "Global")?.map((item, index) => (
              <option key={index} value={item?._id}>{item?.name}</option>
              ))}
          </select>
        </Col> }
        <Col className='mr-3'>
          <Dropdown overlay={roleMenu} trigger={["click"]}>
            <Button>
              {roleFilter} <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
      {!result?.isLoading && (
        <TableComponent
          dataSource={dataSource?.length > 0 ? dataSource : []}
          columns={columns}
          pagination={pagination}
          handlePaginationChange={handlePageChange}
        />
      )}
    </div>
  )
}
export default AssignedListing