import React, { useEffect, useState } from 'react'
import { Avatar, Button, Col, Form, Input, Modal, Row, Spin } from 'antd'
import { BsFillEyeFill } from "react-icons/bs";
import { IoEyeOffSharp } from "react-icons/io5";
import { t } from 'i18next';
import { MediaEndpoints, colorCode } from 'Utils/MediaEndpoints';
import { fileUrl } from 'Constants/Url';
import { validate } from 'Utils/UtilityFunctions';
import { useGetDataProfileQuery, useUpdateAdminDataMutation, useUpdatePasswordMutation } from 'Rtk/services/profile';
import Toast from 'Utils/Toast';
import BreadCrumbComponent from 'Components/BreadCrumbComponent';
import LoaderComponent from 'Components/LoaderComponent';

const Profile = () => {
    const [form] = Form.useForm();
    const [formProfile] = Form.useForm();
    const [loadingProfile, setLoadingProfile] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [updateProfileFile, setUpdateProfileFile] = useState(null);
    const [updateProfileImgSrc, setUpdateProfileImgSrc] = useState(null);
    const [imageUrl, setImageUrl] = useState("")
    const [updatePassword] = useUpdatePasswordMutation();
    const [updaAdminData] = useUpdateAdminDataMutation();

    const result = useGetDataProfileQuery({
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        formProfile.setFieldsValue({
            name: result?.data?.data?.name,
            email: result?.data?.data?.email,
        })
        setImageUrl(result?.data?.data?.profile_pic)
    }, [result])

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

    // Change password
    const onFinishChangePassword = async (values) => {
        let payload = {
            new_password: values?.new_password,
            old_password: values?.old_password
        }
        const result = await updatePassword(payload).unwrap();
        setOpenChangePassword(!openChangePassword)
        Toast("s", result?.message)
        form.resetFields()
        setLoadingProfile(false)
    }

    const onFinishFailed = (values) => {
        Toast("error", "Please Fill  All The Fields.")
    }

    const updateProfile = async (value) => {
        var data = new FormData();
        data.append("name", value?.name);
        if (updateProfileFile) {
            data.append("profile_pic", updateProfileFile);
        }
        try {
            let result = await updaAdminData(data).unwrap();
            Toast('s', result?.message);
        } catch (error) {
            // setOpenDelete(false)
            if (error?.data?.message) {
                Toast('e', error?.data?.message)
            } else Toast('e', error?.error)
        }
    }

    const validateInputTrim = (_, value) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error('Please Enter Your Name'));
        }
        return Promise.resolve();
    };

    return (
        <>
            <div className="m-2">
                <div className="flex justify-between items-center">
                    <BreadCrumbComponent title={t('breadcrumb.personalInfo')} />
                    <Button type="ghost" className="authButton" onClick={() => setOpenChangePassword(!openChangePassword)}> {t('buttons.changePass')} </Button>
                </div>
                <Spin spinning={loadingProfile} indicator={<LoaderComponent />}>
                    <div className="backgroundShadow p-3 mt-3 rounded-lg">
                        <Form layout="vertical" className="w-full" form={formProfile} onFinish={updateProfile}>
                            <Row gutter={[16, 16]} align="middle">
                                <Form.Item className="m-auto py-4">
                                    {(imageUrl && !updateProfileImgSrc) ?
                                        <div className='text-center me-4'>
                                            <button
                                                type="button"
                                                className='bg-transparent border-0 p-0'
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    document.getElementById("updateProfileFile").click();
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        document.getElementById("updateProfileFile").click();
                                                    }
                                                }}>
                                                <img
                                                    src={`${fileUrl}${imageUrl}`}
                                                    alt='img'
                                                    className='rounded w-[150px] h-[150px]'
                                                />
                                            </button>
                                        </div>
                                        : <div role="button">
                                            <Avatar size={170} shape="square" id="profileUpdateImg"
                                                onClick={() => { document.getElementById("updateProfileFile").click(); }}
                                                src={updateProfileImgSrc ? updateProfileImgSrc.includes("base64") ? `${updateProfileImgSrc}` : `${fileUrl}${updateProfileImgSrc}` : MediaEndpoints.uploadImage}
                                            />
                                        </div>}
                                    <input accept="image/*" onChange={profileReadURL} type="file" className="hidden" id="updateProfileFile" />
                                </Form.Item>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                            <Form.Item name="name" label={t('users.name')} rules={[{ validator: validateInputTrim }]} required={true}>
                                                <Input placeholder="Name" allowClear={true} className="authInput" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                            <Form.Item name="email" label={t('users.email')}>
                                                <Input placeholder="Email" className="authInput" type="email" readOnly={true} disabled />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Form.Item className="flex justify-center">
                                <Button loading={result?.loading} title="" htmlType="submit" className="authButton">
                                    {t('buttons.update')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>
                {/* Change Password */}
                <Modal title={t('buttons.changePass')} open={openChangePassword} onCancel={() => { form.resetFields(); setOpenChangePassword(!openChangePassword); }} centered footer={null}>
                    <Form form={form} name="Auth" initialValues={{ remember: true }} onFinish={onFinishChangePassword} onFinishFailed={onFinishFailed}>
                        <Form.Item required={true} label={t('inputLabels.oldPassword')} className="mb-0" name="old_password" autoComplete="off" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} rules={[{ required: true, message: "Please Enter Your Old Password!" }]}>
                            <Input.Password placeholder="******" className="authInput" iconRender={(visible) => visible ? (<BsFillEyeFill className={`text-${colorCode?.defaultDarkColor}`} />) : (<IoEyeOffSharp className={`text-${colorCode?.defaultLightColor}`} />)} />
                        </Form.Item>
                        <Form.Item required={true} label={t('inputLabels.newPassword')} className="mb-0" name="new_password" autoComplete="off" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: t('toastMessage.password') }, { min: 8, message: `Minumun length must be 8 digit` }, {
                                validator: validate
                            },]}
                        >
                            <Input.Password placeholder="******" className="authInput" iconRender={(visible) => visible ? (<BsFillEyeFill className={`text-${colorCode?.defaultDarkColor}`} />) : (<IoEyeOffSharp className={`text-${colorCode?.defaultLightColor}`} />)} />
                        </Form.Item>
                        <Form.Item required={true} label={t('inputLabels.confirmPassword')} className="mb-0" name="confirm_password" autoComplete="off" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} dependencies={["new_password"]}
                            rules={[{ required: true, message: "Please Enter Confirm Password!" }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue("new_password") === value) { return Promise.resolve(); } return Promise.reject(new Error("The new password that you entered do not match!")); }, }),]}
                        >
                            <Input.Password placeholder="******" className="authInput" iconRender={(visible) => visible ? (<BsFillEyeFill className={`text-${colorCode?.defaultDarkColor}`} />) : (<IoEyeOffSharp className={`text-${colorCode?.defaultLightColor}`} />)} />
                        </Form.Item>
                        <Form.Item className="text-center mt-5 flex justify-center">
                            <Button htmlType="submit" className="authButton" loading={loadingProfile}>{t('buttons.changePass')}</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    )
}
export default Profile