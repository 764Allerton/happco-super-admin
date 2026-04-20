/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Button, Col, Form, Input, Row, Select } from 'antd';
import { fileUrl } from 'Constants/Url';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUploadImageMutation } from 'Rtk/services/common';
import { useHcAddDetailsMutation, useUpdateHcDetailsMutation } from 'Rtk/services/hc';
import { MediaEndpoints } from 'Utils/MediaEndpoints';
import { Modal } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import EditorComponent from 'Components/EditorComponent';
import Toast from 'Utils/Toast';

const AddEditAction = () => {
    const navigate = useNavigate();
    const [updateProfileImgSrc, setUpdateProfileImgSrc] = useState(null);
    const [addFile, setAddFile] = useState(null);
    const [descriptions, setDescriptions] = useState('');
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState("")
    const [hc_code, setHcCode] = useState("")
    const location = useLocation();
    const selectedId = location?.state?.id;
    const record = location?.state?.record;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const videoRef = useRef(null);
    const [addHcDetails] = useHcAddDetailsMutation();
    const [updateHcDetails] = useUpdateHcDetailsMutation();
    const [uploadImage] = useUploadImageMutation();

    

    useEffect(() => {
        form.setFieldValue('subTitle', record?.title)
        form.setFieldValue('name', record?.titleFirst)
        setDescriptions(record?.description)
        form.setFieldValue('description', record?.description)
        setImageUrl(record?.icon)
        setHcCode(record?.hc_code)
        form.setFieldValue('type', record?.type)
    }, [record])

    const onCancelModalButton = () => {
        form.resetFields();
        setUpdateProfileImgSrc(null);
        setAddFile(null);
        setImageUrl(null)
    }

    const handleSubmitAddHc = async (value) => {
        var data = new FormData();
        if (addFile) {
            data.append("file", addFile);
        }
        try {
            var payload = {
                type: value?.type,
                description: descriptions,
                titleFirst: value?.name,
                title: value?.subTitle
            }
            if (addFile) {
                const result = await uploadImage(data).unwrap();
                payload.icon = result?.data[0];
            }
            if (selectedId) payload.Id = selectedId;
            try {
                const resultAll = selectedId ? await updateHcDetails(payload).unwrap() : await addHcDetails(payload).unwrap();
                Toast('s', resultAll?.message);
                navigate('/hc')
                if (!selectedId) {
                    form.resetFields()
                    setImageUrl(null)
                } else {
                    form.setFieldValue('name', resultAll?.data?.titleFirst)
                    form.setFieldValue('subTitle', resultAll?.data?.title)
                    setDescriptions(resultAll?.data?.description)
                    setImageUrl(resultAll?.data?.icon)
                    form.setFieldValue('type', resultAll?.data?.type)
                }
            } catch (error) {
                if (error?.data?.message) {
                    Toast('e', error?.data?.message);
                }
            }
        } catch (error) {
            if (error?.data?.message) {
                Toast('e', error?.data?.message)
            } else {
                Toast('e', error?.error)
            }
        }
    }

    const profileReadURL = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setUpdateProfileImgSrc(e.target.result)
            };
            reader.readAsDataURL(event.target.files[0]);
            setAddFile(event.target.files[0])
        }
    };

    const onDescriptionChange = (value) => {
        setDescriptions(value)
    }

    const handleVideoClick = () => {
        setIsModalVisible(true); // Open the modal when the icon is clicked
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.play();
            }
        }, 1000);
    };

    const handleModalClose = () => {
        if (videoRef.current) {
            videoRef.current.pause(); // Pause the video
            videoRef.current.currentTime = 0; // Optionally reset to the beginning
        }
        setIsModalVisible(false); // Close the modal
    };
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, [videoRef.current])


    const handleModalOpen = () => {
        // Once the modal is open, play the video
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    return (
        // <div>JAI MAA</div>
        <div>
            <Form layout='vertical' className='my-3 w-100 modalForm' form={form} onFinish={handleSubmitAddHc} >
                <Row className='justify-between my-3'>
                    {!selectedId ?
                        <Col xs={24} md={24} lg={24} xl={24}>
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
                                                className='rounded w-[150px] h-[150px] mb-1'
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
                                                size={250}
                                                id="profileUpdateImg"
                                                shape='square'
                                                className='rounded w-[150px] h-[150px] mb-1'
                                                src={updateProfileImgSrc?.includes('base64') ? `${updateProfileImgSrc}` : MediaEndpoints.uploadImage}
                                            />
                                        </div>
                                    )}
                                </div>
                                <input accept="image/*" type="file" onChange={profileReadURL} style={{ display: "none" }} id="updateProfileFile" />
                            </Form.Item>
                        </Col>
                        :
                        <>
                            <Col xs={24} md={record?.video_url ? 12 : 24} lg={record?.video_url ? 12 : 24} xl={record?.video_url ? 12 : 24} className='flex justify-center items-center'>
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
                                                    className='rounded w-[150px] h-[150px] mb-1'
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
                                                    size={250}
                                                    id="profileUpdateImg"
                                                    shape='square'
                                                    className='rounded w-[150px] h-[150px] mb-1'
                                                    src={updateProfileImgSrc?.includes('base64') ? `${updateProfileImgSrc}` : MediaEndpoints.uploadImage}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <input accept="image/*" type="file" onChange={profileReadURL} style={{ display: "none" }} id="updateProfileFile" />
                                </Form.Item>
                            </Col>
                            {record?.video_url && (
                                <Col xs={24} md={12} lg={12} xl={12} className='flex justify-center items-center'>
                                    <Form.Item className="m-auto py-4" name="image">
                                        <div className="flex items-center justify-center">
                                            {/* Show play icon instead of the video */}
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={handleVideoClick}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleVideoClick(); // Open modal on Enter key press
                                                    }
                                                }}
                                                className="text-center">
                                                <PlayCircleOutlined style={{ fontSize: '50px', color: '#1890ff' }} /> {/* Play icon */}
                                                <div className='mt-1'>Play Video</div>
                                            </div>
                                        </div>
                                    </Form.Item>
                                </Col>
                            )}
                        </>
                    }
                    {selectedId &&
                        <Col xs={24} md={24} lg={24} xl={24} className='mt-2 mb-5'>
                            <span style={{ fontWeight: "bold", fontSize: 18 }}>Action Code : {hc_code}</span>
                        </Col>}
                    <Col xs={24} md={24} lg={10} xl={10}>
                        <Form.Item name="name" label="Title" rules={[{ required: true, message: 'Please enter title', whitespace: true }]}>
                            <Input placeholder={'Title'} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={10} xl={10}>
                        <Form.Item
                            name="type"
                            label="Type"
                            rules={[{ required: true, message: 'Please select Type' }]}>
                            <Select
                                placeholder="Select Type"
                                options={[
                                    { label: 'Family & Friends', value: 'family' },
                                    { label: 'Self (Inner Work)', value: 'self' },
                                    { label: 'Superior', value: 'superior' },
                                    { label: 'Direct Report', value: 'report' },
                                    { label: 'Peers (Co-Workers)', value: 'peers' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24}>
                        <Form.Item name="subTitle" label="Sub-Title" rules={[{ required: true, message: 'Please enter sub-title', whitespace: true }]}>
                            <Input placeholder={'Sub-title'} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24}>
                        <Form.Item name="description" label="Description" >
                            <EditorComponent desc={descriptions} className={"min-h-[150px]"} onEditorChange={(value) => { onDescriptionChange(value) }} />
                        </Form.Item>
                    </Col>

                </Row>
                <div className='flex justify-center items-center'>
                    <Form.Item>
                        <Button onClick={onCancelModalButton} className={'commonButton bg-gray-600 rounded border-none text-white mr-3 w-[11.5rem] smMin:w-[5rem]'}>Cancel</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type='ghost' className={'commonButton text-white !bg-defaultLightColor rounded w-[11.5rem] smMin:w-[5rem]'} htmlType={'submit'}>Submit</Button>
                    </Form.Item>
                </div>
            </Form>
            <Modal
                title="Video Player"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={400}
                onAfterOpen={handleModalOpen}
                destroyOnClose
                centered
            >
                <div className="video-container">
                    <video ref={videoRef} controls width="400px" height="400px">
                        <source src={`${fileUrl}${record?.video_url}`} type="video/mp4" />
                        {/* Add subtitles if needed */}
                        <track kind="subtitles" src={record?.subtitlesUrl} label="English" default />
                    </video>
                </div>
            </Modal>
        </div>
    )
}

export default AddEditAction