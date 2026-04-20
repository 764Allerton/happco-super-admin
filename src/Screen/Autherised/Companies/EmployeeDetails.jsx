import React, { useEffect, useState } from 'react'
import { Avatar, Col, Row, Dropdown, Menu, DatePicker, Button, Space } from 'antd'
import { fileUrl } from 'Constants/Url';
import { useSearchParams } from 'react-router-dom';
import { useGetEmpByEmpIdQuery, useGetHCListByTypeQuery, useGetActionCountUsersAdminQuery, useGetDeptListQuery } from 'Rtk/services/company';
import { DownOutlined } from "@ant-design/icons";
import BreadCrumbComponent from 'Components/BreadCrumbComponent';
import DashTableComp from 'Components/DashTableComp';
import DisplayValueComp from 'Components/DisplayValueComp'
import LoaderComponent from 'Components/LoaderComponent';
import Toast from 'Utils/Toast';
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const cardUser = 'border-2 border-slate-300 rounded-md pr-4 py-7 smMin:pr-1 shadow-md font-bold';
const taskStyle = "bg-[#F4F4F4] p-4 w-[168px] h-[68px] text-lg text-center rounded flex items-center justify-center mdMin:mb-1 my-4"

const EmployeeDetails = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemKeyword, setSelectedItemKeyword] = useState(null);
    const [tableColumns, setTableColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [actionsBox, setActionsBox] = useState([])
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [dataUser, setDataUser] = useState([]);
    const [displayType, setDisplayType] = useState(null);
    const [searchParams] = useSearchParams(); // Initialize useSearchParams
    const type = searchParams.get('type');
    const name = searchParams.get('name');
    const id = searchParams.get('id');
    const [track, setTrack] = useState([]);
    const [flag, setFlag] = useState(false);
    const [actionGetId, setActionGetId] = useState(id);
    const [selectedFilter, setSelectedFilter] = useState("Select Filter");
    const [selectedDeptt, setSelectedDeptt] = useState("");
    const [showRangePicker, setShowRangePicker] = useState(false);
    const [subType, setSubType] = useState(null);
    const [divisionId, setDivisionId] = useState(null);
    const [depttList, setDepttList] = useState([]);
    const [dateRange, setDateRange] = useState(null);

    const getDateRange = (key) => {
        switch (key) {
            case "Today":
                return [dayjs().startOf("day"), dayjs().endOf("day")];
            case "This Week":
                return [dayjs().startOf("week"), dayjs().endOf("week")];
            case "This Month":
                return [dayjs().startOf("month"), dayjs().endOf("month")];
            case "Last Week":
                return [
                    dayjs().subtract(1, "week").startOf("week"),
                    dayjs().subtract(1, "week").endOf("week")
                ];
            case "Last Month":
                return [
                    dayjs().subtract(1, "month").startOf("month"),
                    dayjs().subtract(1, "month").endOf("month")
                ];
            default:
                return null;
        }
    };

    const handleMenuClick = ({ key }) => {
        setSelectedFilter(key);
        setShowRangePicker(key === "Select Range");
        if (key !== "Select Range") {
            setDateRange(getDateRange(key));
        } else {
            setDateRange(null);
        }
    };

    const handleRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            const startDate = dates[0].startOf("day");
            const endDate = dates[1].endOf("day");
            setDateRange([startDate, endDate]);
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="Select Filter">Select Filter</Menu.Item>
            <Menu.Item key="Today">Today</Menu.Item>
            <Menu.Item key="This Week">This Week</Menu.Item>
            <Menu.Item key="This Month">This Month</Menu.Item>
            <Menu.Item key="Last Week">Last Week</Menu.Item>
            <Menu.Item key="Last Month">Last Month</Menu.Item>
            <Menu.Item key="Select Range">Select Range</Menu.Item>
        </Menu>
    );

    let allActions = [
        {
            "id": "1",
            "label": "Direct Reports",
            "selected_item": {
                "id": 1,
                "title": "Direct Reports"
            },
            "data": [
                {
                    "id": 1,
                    "title": "Direct Reports"
                }
            ]
        },
        {
            "id": "2",
            "label": "Peers",
            "selected_item": {
                "id": 1,
                "title": "Peers"
            },
            "data": [
                {
                    "id": 1,
                    "title": "Peers"
                }
            ]
        },
        {
            "id": "3",
            "label": "Superiors",
            "selected_item": {
                "id": 1,
                "title": "Superiors"
            },
            "data": [
                {
                    "id": 1,
                    "title": "Superiors"
                }
            ]
        }
    ]

    const result = useGetEmpByEmpIdQuery({ user_id: id }, {
        refetchOnMountOrArgChange: true,
    });

    const HCList = useGetHCListByTypeQuery({ type: selectedItemKeyword }, {
        refetchOnMountOrArgChange: true,
    })

    const actionCount = useGetActionCountUsersAdminQuery({ user_id: actionGetId, type: selectedItemKeyword, startDate, endDate }, {
        refetchOnMountOrArgChange: true,
    })

    const departmentList = useGetDeptListQuery({ divisionId }, {
        refetchOnMountOrArgChange: true,
    })

    const handleEmpClick = (emp) => {
        setSelectedItem(emp);
        switch (emp?.data[0]?.title) {
            case "Peers":
                setSelectedItemKeyword("peers");
                setDisplayType("Peers")
                break;
            case "Superiors":
                setSelectedItemKeyword("superior");
                setDisplayType("Superiors")
                break;
            case "Direct Reports":
                setSelectedItemKeyword("report");
                setDisplayType("Direct Reports")
                break;
            case "Inner Worker":
                setSelectedItemKeyword("self");
                setDisplayType("Inner Worker")
                break;
            case "Family and Friend":
                setSelectedItemKeyword("family");
                setDisplayType("Family and Friend")
                break;
            default:
                setSelectedItemKeyword(null);
        }
        if (!flag) {
            setActionGetId(id)
        }
    };

    const loadUnderUserData = (data) => {
        setFlag(true)
        setActionGetId(data?.member_id)
        let t = track
        t.push(data)
        setTrack(t)
        setSelectedDeptt("")
    }

    const popUserFromTrack = (t, i) => {
        let tr = track
        tr.splice(i + 1, tr.length)
        setTrack(tr)
        setActionGetId(t.member_id)
        setSelectedDeptt("")
    }

    useEffect(() => {
        if (result?.isSuccess) {
            const data = result?.data?.data;
            setImageUrl(data?.profile_pic)
            setDataUser([
                { title: "Name", value: data?.full_name },
                { title: "Email", value: data?.email },
                { title: "Company Name", value: data?.companyId?.name ?? "--" },
                { title: "Department", value: data?.departmentId?.name ? data?.departmentId?.name : "--" },
                { title: "Division", value: data?.division?.name ?? "--" },
                { title: "Job Title", value: data?.job_title ? data?.job_title : "--" }
            ]);
            if (data?.sub_type == 6) {
                allActions = allActions.filter((a) => a.id !== "1")
            }
            if (data?.sub_type == 2) {
                allActions = allActions.filter((a) => a.id !== "3")
            }
            handleEmpClick(allActions[0])
            setActionsBox(allActions)
            setDivisionId(data?.division?._id)
            setSubType(data?.sub_type)
            let t = track
            let temp = t?.filter(it => it.member_id == id)
            if (temp?.length == 0) {
                t.push({
                    member_id: id,
                    name: data?.full_name
                })
            }
            setTrack(t)
        }
        if (result?.error?.status == 400) {
            Toast('e', result?.error?.data?.message)
        }
    }, [result])

    useEffect(() => {
        if (HCList.isSuccess) {
            let list = HCList?.data?.data
            const temp = []
            list?.map((item) => {
                { console.log("items", item) }
                temp.push({
                    title: item?.hc_code,
                    key: item?.hc_code,
                    titleText: item?.titleFirst
                })
            })
            setTableColumns(temp)
        }
    }, [HCList])

    useEffect(() => {
        if (actionCount?.isSuccess) {
            if (selectedDeptt == "") {
                setDataSource(actionCount?.data?.data)
            } else {
                setDataSource(actionCount?.data?.data?.filter((f) => f?.memberId?.departmentId == selectedDeptt))
            }
        }
    }, [actionCount, selectedDeptt])

    useEffect(() => {
        if (departmentList.isSuccess) {
            const list = departmentList?.data?.data
            console.log("list", list)
            setDepttList(list)
        }
    }, [departmentList])

    useEffect(() => {
        if (dateRange) {
            setStartDate(dateRange[0].unix())
            setEndDate(dateRange[1].unix())
        } else {
            setStartDate(null)
            setEndDate(null)
        }
    }, [dateRange])

    return (
        <div>
            <div className='flexBetween mb-4 smMin:flex-col'>
                <BreadCrumbComponent
                    mainTitle="Home"
                    subtitle="Companies"
                    subtitle2={type}
                    title={name}
                    className="smMin:mb-2"
                />
            </div>
            {result?.isLoading ? <LoaderComponent />
                :
                <div className={cardUser}>
                    <Row gutter={[16, 16]} className='mdMin:px-3'>
                        <Col xs={24} sm={24} md={7} lg={5}>
                            <div className='flex-col flexCenter'>
                                <div className='my-1'>Profile Pic</div>
                                {imageUrl ? <Avatar size={100} src={`${fileUrl}${imageUrl}`} />
                                    : <Avatar size={100} className='bg-defaultLightColor text-[55px]'>{name?.charAt(0)}</Avatar>}
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={17} lg={19}>
                            <Row gutter={[20, 20]}>
                                {dataUser?.map((item, index) => (
                                    <Col key={index} xs={24} sm={12} md={11} lg={8}>
                                        <DisplayValueComp title={item.title} value={item.value} />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </div>
            }
            <div className='my-10 pl-10 smMin:pl-3' style={{ width: "100%", textAlign: "right" }}>
                <Row style={{ justifyContent: "right" }}>
                    {subType && subType == 5 && <Col>
                        <select value={selectedDeptt} onChange={(e) => setSelectedDeptt(e?.target?.value)} className='mr-3 p-1' style={{ border: "1px solid #ccc", borderRadius: 5 }}>
                            <option selected={true} value={""}>Select Department</option>
                            {depttList?.filter((f) => f?.name != "Global")?.map((item, index) => (
                                <option key={index} value={item?._id}>{item?.name}</option>
                            ))}
                        </select>
                    </Col>}
                    <Col>
                        <Dropdown overlay={menu} trigger={["click"]}>
                            <Button>
                                {selectedFilter} <DownOutlined />
                            </Button>
                        </Dropdown>
                        {showRangePicker && (
                            <Space style={{ marginTop: 10, marginLeft: 10 }}>
                                <RangePicker onChange={handleRangeChange} />
                            </Space>
                        )}
                    </Col>
                </Row>
                <Row gutter={[30, 20]}>
                    {actionsBox?.length > 0 && actionsBox?.map((item) => {
                        return (
                            <Col key={item?.id}>
                                <div
                                    className={`${taskStyle} ${selectedItem?.id === item?.id ? 'selectedBox' : ''}`}
                                    onClick={() => handleEmpClick(item)}
                                    role='button'
                                    tabIndex={0}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            handleEmpClick(item)
                                        }
                                    }}>{item?.label}
                                </div>
                            </Col>
                        )
                    })}
                </Row>
                <Row>
                    <Col className='mt-2'>
                        <p style={{ fontWeight: "bold", fontSize: 16 }}>{track?.map((t, i) => (
                            <>
                                <button onClick={() => popUserFromTrack(t, i)} key={i} style={{ cursor: "pointer" }}>&nbsp;{t.name + " /"}</button>
                            </>
                        ))}</p>
                    </Col>
                </Row>
                <div>
                    <DashTableComp
                        columns={tableColumns}
                        dataSource={dataSource}
                        type={displayType ?? ""}
                        from={"hc"}
                        loadData={loadUnderUserData}
                        selectedItem={selectedItemKeyword}
                    />
                </div>
            </div>
        </div>
    )
}
export default EmployeeDetails