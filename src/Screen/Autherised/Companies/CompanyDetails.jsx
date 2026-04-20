/*eslint-disable*/
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Tooltip, Modal, Input, Menu, Dropdown } from 'antd';
import { useDivisionDetailsByIdQuery, useGetCompanyDetailsGraphActiveUSersQuery, useGetdivisionEmpTypeCountQuery, useResetHrCodeMutation, useUpdateCompanyDetailsMutation } from 'Rtk/services/company';
import { CgSync, CgEditBlackPoint } from 'react-icons/cg';
import { DownOutlined } from "@ant-design/icons";
import bag from 'Assets/Media/bag.png'
import HappCoachModal from 'Components/HappCoachModal';
import Toast from 'Utils/Toast';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import dayjs from "dayjs";

let companyBoxList = [
    { _id: "all", name: "All Employees", count: "0" },
    { _id: "directors", name: "Board of Directors", count: "0" },
    { _id: "ceo", name: "CEO", count: "0" },
    { _id: "vp", name: "VPs", count: "0" },
    { _id: "managers", name: "Managers", count: "0" },
    { _id: "tl", name: "Team Leaders", count: "0" },
    { _id: "employees", name: "Employees", count: "0" },
    { _id: "hr", name: "HR", count: "0" }
]

export const CompanyDetails = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const location = useLocation();
    const [addNewHappCoachModal, setAddNewHappCoachModal] = useState(false);
    const [openModalEditEmail, setOpenModalEditEmail] = useState(false);
    const [divisionData, setDivisionData] = useState({});
    const companyId = location?.state?.record?._id;
    const divisionId = location?.state?.record?.divisions?._id
    const arrow = 'Show'
    const [dateRange, setDateRange] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("Current Year");
    const [startDate, setStartDate] = useState(dayjs().startOf("year").unix())
    const [endDate, setEndDate] = useState(dayjs().endOf("year").unix())
    const [chartKey, setChartKey] = useState(0);
    const [options, setOptions] = useState({});

    const getDateRange = (key) => {
        switch (key) {
            case "Last 3 Months":
                return [
                    dayjs().subtract(3, "months").startOf("month"),
                    dayjs().endOf("month")
                ];
            case "Last 6 Months":
                return [
                    dayjs().subtract(6, "months").startOf("month"),
                    dayjs().endOf("month")
                ];
            case "Last Year":
                return [
                    dayjs().subtract(1, "year").startOf("year"),
                    dayjs().subtract(1, "year").endOf("year")
                ];
            case "Current Year":
                return [dayjs().startOf("year"), dayjs().endOf("year")];
            default:
                return [dayjs().startOf("year"), dayjs().endOf("year")];
        }
    };

    const handleMenuClick = ({ key }) => {
        setSelectedFilter(key);
        setDateRange(getDateRange(key));
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="Current Year">Current Year</Menu.Item>
            <Menu.Item key="Last 3 Months">Last 3 Months</Menu.Item>
            <Menu.Item key="Last 6 Months">Last 6 Months</Menu.Item>
            <Menu.Item key="Last Year">Last Year</Menu.Item>
        </Menu>
    );

    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }
        if (arrow === 'Show') {
            return true;
        }
        return {
            pointAtCenter: true,
        };
    }, [arrow]);

    const resultGraphActive = useGetCompanyDetailsGraphActiveUSersQuery({ companyId: companyId, divisionId: divisionId, startDate, endDate }, {
        refetchOnMountOrArgChange: true,
    });

    const resultDivisionDetails = useDivisionDetailsByIdQuery({ companyId: companyId, divisionId: divisionId }, {
        refetchOnMountOrArgChange: true, skip: !divisionId,
    });

    const resultDivisionEmpTypeCount = useGetdivisionEmpTypeCountQuery({ companyId: companyId, divisionId: divisionId }, {
        refetchOnMountOrArgChange: true, skip: !divisionId,
    });

    const [resetHrCode] = useResetHrCodeMutation();
    const [updateCompanyDetails] = useUpdateCompanyDetailsMutation();

    const subTypeToIdMap = {
        1: "managers",
        2: "directors",
        3: "tl", // Assuming this is for team leaders
        4: "vp",
        5: "ceo",
        6: "employees",
        7: "hr" // Assuming you have a role for sub_type 7
    };

    const handleCancel = () => {
        form.resetFields();
        setAddNewHappCoachModal(false)
    };

    const handleSubmit = () => {
        form.resetFields();
        setAddNewHappCoachModal(false)
    };

    const handleReset = async () => {
        const id = divisionData?._id;
        let payload = {
            Id: id,
        }
        try {
            await resetHrCode(payload).unwrap();
            Toast('s', `Hr code has been generated. Sent to ${divisionData?.division_email} email`);
        } catch (error) {
            if (error?.data?.message) {
                Toast('e', error?.data?.message)
            } else Toast('e', error?.error)
        }
    }

    const submitEditEmailCompany = async (value) => {
        let payload = {
            divisionId: divisionId,
            Id: companyId,
            contact_person_email: value?.email
        }
        try {
            let result = await updateCompanyDetails(payload).unwrap();
            Toast('s', result?.message);
            setOpenModalEditEmail(false);
        } catch (error) {
            setOpenModalEditEmail(false)
            if (error?.data?.message) {
                Toast('e', error?.data?.message)
            } else Toast('e', error?.error)
        }
    }

    const handleEditEmail = () => {
        form.setFieldValue('email', divisionData?.division_email)
        setOpenModalEditEmail(true)
    }

    const onCancelModalButton = () => {
        form.resetFields()
        setOpenModalEditEmail(false)
    }

    useEffect(() => {
        setDivisionData(resultDivisionDetails?.data?.data)
    }, [resultDivisionDetails])

    // company info boxes data
    useEffect(() => {
        const inputData = resultDivisionEmpTypeCount?.data?.data?.bySubType;
        const boxAll = companyBoxList?.find(box => box?._id === 'all');
        boxAll.count = "0";
        if (resultDivisionEmpTypeCount?.data?.data?.totalCount) {
            boxAll.count = resultDivisionEmpTypeCount?.data?.data?.totalCount
        }
        if (inputData) {
            inputData?.forEach(item => {
                const idToUpdate = subTypeToIdMap[item?.sub_type];
                const companyBoxItem = companyBoxList.find(box => box?._id === idToUpdate);
                if (companyBoxItem) {
                    companyBoxItem.count = item?.count?.toString(); // Update the count and convert to string if needed
                }
            });
        }
    }, [resultDivisionEmpTypeCount])

    useEffect(() => {
        if (resultGraphActive?.isSuccess) {
            let op = {
                title: {
                    text: 'Percentage of Active Users',
                    align: 'left'
                },
                subtitle: {
                    text: 'Separated By Departments.',
                    align: 'left'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                yAxis: {
                    title: {
                        text: 'Active Employees'
                    }
                },
                xAxis: {
                    categories: resultGraphActive?.data?.data?.months,
                    title: {
                        text: 'Range as per selected option / filter'
                    }
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        }
                    }
                },
                series: resultGraphActive?.data?.data?.series,
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            }
            setOptions(op)
            setChartKey((pre) => !pre)
        }
    }, [resultGraphActive, resultGraphActive?.data])

    useEffect(() => {
        if (dateRange) {
            setStartDate(dateRange[0].unix())
            setEndDate(dateRange[1].unix())
        }
    }, [dateRange])

    return (
        <div>
            <Row>
                <Col sm={24} md={8} lg={6} xl={6} className='p-3 smMin:w-full'>
                    <div className='rounded-[15px] shadow'>
                        <div className='flexCenter rounded-t-[15px] font-bold bg-[#E3F1EE] text-xl mdMin:text-lg py-10'>
                            {divisionData?.name ? (divisionData?.companyId?.name) : "--"}
                        </div>
                        <div className='py-5 px-2'>
                            <div className='pl-3 py-3' key={divisionData?._id}>
                                <div className='mb-2 py-2'>
                                    <div>Company Name</div>
                                    <div className='font-extrabold'>{divisionData?.companyId?.name ?? "--"}</div>
                                </div>
                                <div className='mb-2 py-2'>
                                    <div>Division</div>
                                    <div className='font-extrabold'>{divisionData?.name ?? "--"}</div>
                                </div>
                                <div className='mb-2 py-2'>
                                    <div>Hr Code</div>
                                    <div className='flexBetween' >
                                        <div className='font-extrabold'>{divisionData?.hrCode ?? '--'}</div>
                                        {divisionData?.hrCode && <div className='flex'>
                                            <div className='flexCenter cursor-pointer bg-defaultLightColor  rounded-md me-1'>
                                                <Tooltip placement="top" title={"Reset Hr Code"} arrow={mergedArrow}>
                                                    <div>
                                                        <CgSync size={20} color='white' onClick={handleReset} />
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                                <div className='mb-2 py-2'>
                                    <div>Contact Person Email</div>
                                    <div className='flexBetween'>
                                        <div className='font-extrabold'>{divisionData?.division_email ?? '--'}</div>
                                        {divisionData?.division_email && (
                                            <div className='flex'>
                                                <div className='flexCenter cursor-pointer bg-defaultLightColor rounded-md'>
                                                    <Tooltip placement="top" title={"Edit Contact Email"} arrow={mergedArrow}>
                                                        <div>
                                                            <CgEditBlackPoint size={20} color='white' onClick={handleEditEmail} />
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='mb-2 py-2'>
                                    <div>Employees</div>
                                    <div className='font-extrabold'>{divisionData?.employee_Count ?? '--'}</div>
                                </div>
                                <div className=''>
                                    {divisionData?.clt?.length > 0 && <div>CLT</div>}
                                    <div className='font-bold'>
                                        {Array.isArray(divisionData?.clt) ? (
                                            divisionData?.clt?.map((val, index) => (
                                                <div key={index} className='flex items-center justify-between'>
                                                    <div>{val?.first_name + " " + val?.last_name}</div>
                                                </div>
                                            ))
                                        ) : null}
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    {divisionData?.happcoachId?.length > 0 && <div>HappCoach</div>}
                                    <div className='font-bold'>
                                        {Array.isArray(divisionData?.happcoachId) ? (
                                            divisionData?.happcoachId?.map((val, index) => (
                                                <div key={index} className='flex items-center justify-between'>
                                                    <div>{val?.happcoachId?.first_name + " " + val?.happcoachId?.last_name}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div></div>                                                    // <div className='flex items-center justify-between'>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col sm={24} md={16} lg={18} xl={18}>
                    <div>
                        <Row gutter={[20, 20]} className='p-3'>
                            {
                                companyBoxList?.map((item) => {
                                    return (
                                        <Col key={item?._id} sm={24} md={12} lg={8}>
                                            <div className='flex items-center rounded-[15px] h-[93px] border-2 p-3 smMin:w-[87vw] shadow cursor-pointer' onClick={() => navigate(`/compemployee?id=${item._id}`, { state: { companyId: companyId, divisionId: divisionId } })} onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    navigate(`/compemployee?id=${item._id}&companyId=${companyId}&divisionId=${divisionId}`, { state: { companyId: companyId, divisionId: divisionId } });
                                                }
                                            }}
                                                role="button"
                                                tabIndex={0}>
                                                <img src={bag} alt='icon' className='w-[45px] h-[45px] me-4' />
                                                <div>
                                                    <div>{item?.name}</div>
                                                    <div>{item?.count}</div>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                        <div className='py-5'>
                            <Row className='justify-between my-5 py-4'>
                                <Col className='text-2xl font-extrabold'>
                                    Percentage of Active Users In each Department
                                </Col>
                                <Col>
                                    <Dropdown overlay={menu} trigger={["click"]}>
                                        <Button>
                                            {selectedFilter} <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                </Col>
                            </Row>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={options}
                                key={chartKey} // Reinitialize on API update
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal
                title={
                    <div className='text-center font-bold'>Add New Company</div>
                }
                centered
                open={openModalEditEmail}
                onCancel={onCancelModalButton}
                footer={null}>
                <Form layout='vertical' className='my-3 w-100 modalForm' form={form} onFinish={submitEditEmailCompany} >
                    <Row className='justify-between my-3'>
                        <Col xs={24} md={24} lg={24} xl={24}>
                            <Form.Item name="email" label="Contact Person Email" rules={[{ type: 'email', required: true, message: 'Add Correct Email', whitespace: true }]}>
                                <Input placeholder={'Contact Person Email'} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className='flex justify-center items-center'>
                        <Form.Item>
                            <Button onClick={() => { form.resetFields(); setOpenModalEditEmail(false) }} className={'commonButton bg-gray-600 rounded border-none text-white mr-3 w-[11.5rem] smMin:w-[5rem]'}>Cancel</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type='ghost' className={'commonButton text-white !bg-defaultLightColor rounded w-[11.5rem] smMin:w-[5rem]'} htmlType={'submit'}>Submit</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            {addNewHappCoachModal && <HappCoachModal
                visible={addNewHappCoachModal}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
            />}
        </div>
    )
}