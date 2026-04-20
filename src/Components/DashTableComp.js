import { Avatar, Modal } from 'antd';
import { fileUrl } from 'Constants/Url';
import React, { useState } from 'react';
import calIcon from "../Assets/Media/calendar.png"
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Default tooltip styles
import "tippy.js/dist/tippy.css"; // Optional styling themes
import moment from 'moment';

const DashTableComp = ({ columns, dataSource, type, from = null, loadData, selectedItem }) => {

    const [modalContent, setModalContent] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const ShowModalMessage = (data) => {
        const { title, message } = data
        setModalContent(<div><h2 style={{ fontWeight: 'bold', fontSize: 18 }}>{title}</h2>
            <p>{message}</p>
        </div>)
        setModalVisible(true)
    }

    return (
        <>
            <div className='mb-5 flex overflow-x-auto flex-nowrap'>
                <div className={`mt-5`}>
                    <table className='w-100 text-center'>
                        <thead>
                            <tr className='tablehead text-white '>
                                <th className='p-3' key={type} style={{ textAlign: "left" }}>
                                    <div className='p-3' style={{ fontSize: 16, fontWeight: "bold", textDecoration: 'underline' }}>
                                        {type}
                                    </div>
                                </th>
                                {columns.map((col) => (
                                    <th
                                        className='p-4'
                                        key={col.key}
                                        style={{ minWidth: 'auto' }}
                                    >
                                        <Tippy
                                            content={
                                                <div style={{ width: "max-content", padding: "10px" }}>
                                                    <h1 style={{ margin: 0, fontSize: "14px" }}>{col.titleText}</h1>
                                                </div>
                                            }
                                            placement="top"
                                            theme='htp'
                                            allowHTML={true}
                                            interactive={true} // Allows users to hover over tooltip content
                                            appendTo="parent"
                                            delay={100}
                                        >
                                            <span>{col?.key}</span>
                                        </Tippy>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dataSource.length > 0 ? (
                                dataSource.map((data, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid #efefef" }}>
                                        <td
                                            key={data?.memberId?._id}
                                            className="min-w-[220px] p-2"
                                            style={{ textAlign: "left" }}
                                        >
                                            <button
                                                onClick={() => (selectedItem !== "report") ?
                                                    ShowModalMessage({ title: "Invalid Action", message: "Sorry !!! This feature is only available for Direct Report Section." })
                                                    : loadData({
                                                        member_id: data?.memberId?._id,
                                                        name: `${data?.memberId?.first_name} ${data?.memberId?.last_name}`
                                                    })}
                                                style={{
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    background: "none",
                                                    border: "none",
                                                    padding: 0,
                                                    font: "inherit",
                                                    textAlign: "left",
                                                }}
                                            >
                                                <Avatar
                                                    size="medium"
                                                    className="mr-2"
                                                    src={fileUrl + data?.memberId?.profile_pic}
                                                    alt="Profile"
                                                />
                                                <span style={{ fontSize: 16, fontWeight: "bold" }}>
                                                    {`${data?.memberId?.first_name || ""} ${data?.memberId?.last_name || ""}`}
                                                </span>
                                            </button>
                                        </td>
                                        {columns.map((col, idx) => {
                                            const actionData = data.actions?.filter((s) => s.hc_code == col.key)[0];
                                            const scheduleData = actionData?.schedules;
                                            const pendingActions = scheduleData?.filter((f) => f?.action_state === "pending");
                                            const completedActions = scheduleData?.filter((f) => f?.action_state === "complete");
                                            return (
                                                <td key={idx} className='min-w-[70px] p-5 text-center'>
                                                    {scheduleData?.length > 0 ?
                                                        <Tippy
                                                            className={'mt-5'}
                                                            content={
                                                                <div style={{ width: "max-content", height: 200, overflowY: "scroll", padding: "10px" }}>
                                                                    <h1 style={{ margin: 0, fontSize: "18px" }}>Action Details</h1>
                                                                    <p>{`${actionData?.hc_code} - ${actionData?.title}`}</p><br />
                                                                    <div>
                                                                        {pendingActions && pendingActions?.map((pa, index) => (
                                                                            <>
                                                                                {(from && from == "hc") ?
                                                                                    <>
                                                                                        <p key={pa?.fromId} className='min-w-[220px] mb-1' style={{ textAlign: "left" }}>
                                                                                            <Avatar size={'small'} className='mr-2' src={fileUrl + pa?.fromUserDetails?.profile_pic} />
                                                                                            <span style={{ fontSize: 16, fontWeight: "bold" }}>
                                                                                                {`${pa?.fromUserDetails?.first_name ?? '-'} ${pa?.fromUserDetails?.last_name ?? '-'} (to)`}
                                                                                            </span>
                                                                                        </p>
                                                                                        <p key={pa?.toId} className='min-w-[220px] mb-1' style={{ textAlign: "left" }}>
                                                                                            <Avatar size={'small'} className='mr-2' src={fileUrl + pa?.toUserDetails?.profile_pic} />
                                                                                            <span style={{ fontSize: 16, fontWeight: "bold" }}>
                                                                                                {`${pa?.toUserDetails?.first_name ?? '-'} ${pa?.toUserDetails?.last_name ?? '-'}`}
                                                                                            </span>
                                                                                        </p>
                                                                                    </> : null
                                                                                }
                                                                                <p className='min-w-[220px]' style={{ textAlign: "left" }} key={index}>
                                                                                    {`${moment(pa?.scheduleDate * 1000).format('lll')}`}<br />
                                                                                    Action Status: {`${pa?.action_state}`}
                                                                                </p>
                                                                                {pendingActions.length != index + 1 ?
                                                                                    <br /> : null}
                                                                            </>
                                                                        ))}
                                                                        <br />
                                                                        {completedActions && completedActions?.map((ca, index) => (
                                                                            <>
                                                                                {(from && from == "hc") ?
                                                                                    <>
                                                                                        <p key={ca?.fromId} className='min-w-[220px] mb-1' style={{ textAlign: "left" }}>
                                                                                            <Avatar size={'small'} className='mr-2' src={fileUrl + ca?.fromUserDetails?.profile_pic} />
                                                                                            <span style={{ fontSize: 16, fontWeight: "bold" }}>
                                                                                                {`${ca?.fromUserDetails?.first_name ?? '-'} ${ca?.fromUserDetails?.last_name ?? '-'} (to)`}
                                                                                            </span>
                                                                                        </p>
                                                                                        <p key={ca?.toId} className='min-w-[220px] mb-1' style={{ textAlign: "left" }}>
                                                                                            <Avatar size={'small'} className='mr-2' src={fileUrl + ca?.toUserDetails?.profile_pic} />
                                                                                            <span style={{ fontSize: 16, fontWeight: "bold" }}>
                                                                                                {`${ca?.toUserDetails?.first_name ?? '-'} ${ca?.toUserDetails?.last_name ?? '-'}`}
                                                                                            </span>
                                                                                        </p>
                                                                                    </> : null
                                                                                }
                                                                                <p className='min-w-[220px] mb-1' style={{ textAlign: "left" }} key={index}>
                                                                                    {`${moment(ca?.scheduleDate * 1000).format('lll')}`} <br />
                                                                                    Action Status: {`${ca?.action_state}`}
                                                                                </p>
                                                                                {completedActions.length != index + 1 ?
                                                                                    <br /> : null}
                                                                            </>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            }
                                                            placement="right"
                                                            theme='htp'
                                                            allowHTML={true}
                                                            interactive={true} // Allows users to hover over tooltip content
                                                            appendTo="parent"
                                                            delay={100}>
                                                            <span>
                                                                {scheduleData?.length > 0
                                                                    ? completedActions?.length > 0
                                                                        ? `${completedActions?.length}x`
                                                                        : (pendingActions?.length > 0 && <img style={{ height: 30, marginLeft: 6 }} alt="calc_icon" src={calIcon} />)
                                                                    : "-"}
                                                            </span>
                                                        </Tippy> :
                                                        <span>
                                                            {scheduleData?.length > 0
                                                                ? completedActions?.length > 0
                                                                    ? `${completedActions?.length}x`
                                                                    : (pendingActions?.length > 0 && <img style={{ height: 30, marginLeft: 6 }} alt="calc_icon" src={calIcon} />)
                                                                : "-"}
                                                        </span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length}>No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}>
                {modalContent}
            </Modal>
        </>
    );
};
export default DashTableComp;