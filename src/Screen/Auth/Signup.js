import { Form, Input, Button, Row, Col, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { IoMdEyeOff } from 'react-icons/io';
import Image from 'antd/lib/image';
import { MediaEndpoints, colorCode } from 'Utils/MediaEndpoints';
import { useRef, useState } from 'react';
import { fileUrl } from 'Constants/Url';
import { t } from 'i18next';
import { validate } from 'Utils/UtilityFunctions';
import { useSignUpMutation } from 'Rtk/services/auth';
import Toast from 'Utils/Toast';

const inputStyle = "mx-auto my-4 md:my-3 sm:my-2 text-xl font-700"
const inputLabelStyle = "mx-auto p-0 mb-0 w-[100%] text-xs font-700"
const cardAuthStyle = "w-[50%] smMin:w-[100%] smMin:px-0 p-2 px-[2rem] sm:px-[2rem] md:px-[2rem] sm:py-[1rem] lg:py-[2rem] lg:px-[3rem] xl:px-[4.2rem] h-[92.5vh] justify-center items-center"
const formStyle = "w-[90%] md:w-[85%] 2xl:w-[70%]"
const linkStyle = `text-xs font-extrabold italic  hover:text-defaultDarkColor`

const SignupPage = () => {
    const navigate = useNavigate()
    const [signupForm] = Form.useForm();
    const [updateProfileImgSrc, setUpdateProfileImgSrc] = useState(null);
    const [updateProfileFile, setUpdateProfileFile] = useState(null);
    const [signup, { isLoading }] = useSignUpMutation();
    const fileInputRef = useRef(null);

    const handleSignup = async (values) => {
        let payload = {
            email: values?.email,
            password: values?.password,
            phoneNumber: values?.phoneNumber,
            firstName: values?.firstName,
            lastName: values?.lastName,
            os_type: 'web'
        }
        const formDataBody = new FormData();
        formDataBody.append('picture', updateProfileFile)
        Object.keys(payload).forEach(key => {
            formDataBody.append(key, payload[key]);
        });
        try {
            await signup(formDataBody).unwrap();
            navigate('/', { replace: true });
        } catch (error) {
            if (error?.data?.message) {
                Toast('e', error?.data?.message)
            } else Toast('e', error?.error)
        }
    };

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


    return (
        <div className='authPage  '>
            <div className='flex justify-center bg-defaultLightColor h-[92.5vh] w-[50%] items-center smMin:hidden'>
                <Image src={MediaEndpoints.logoLogin} className='logo' width={250} preview={false} />
            </div>
            <div className={`cardAuth ${cardAuthStyle}`}>
                <div className={`text-center ${inputStyle}`}>{t('auth.SignUp.signUp')}</div>
                <Form className={formStyle} form={signupForm} onFinish={handleSignup} layout="vertical" autoComplete="off">
                    <Form.Item name="image" valuePropName="fileList" className='flexCenter' required={true}>
                        <div role="button">
                            <Avatar size={80} shape="square" id="profileUpdateImg"
                                onClick={() => { document.getElementById("updateProfileFile").click(); }}
                                src={updateProfileImgSrc ? updateProfileImgSrc.includes("base64") ? `${updateProfileImgSrc}` : `${fileUrl}${updateProfileImgSrc}` : MediaEndpoints.uploadImage}
                            />
                            <input accept="image/*" onChange={profileReadURL} type="file" className="hidden" ref={fileInputRef} id="updateProfileFile" />
                        </div>
                    </Form.Item>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item name="firstName" label={<h6 className={`${inputLabelStyle}`}>{t('auth.SignUp.firstName')}</h6>} rules={[{ required: true, message: t('toastMessage.firstName') }]} required={true}>
                                <Input placeholder={t('auth.SignUp.firstName')} className="authInput" allowClear={true} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item name="lastName" label={<h6 className={`${inputLabelStyle}`}>{t('auth.SignUp.LastName')}</h6>} rules={[{ required: true, message: t('toastMessage.lastName') }]} required={true}>
                                <Input placeholder={t('auth.SignUp.LastName')} className="authInput" allowClear={true} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item name="email" label={<h6 className={`${inputLabelStyle}`}>{t('auth.SignUp.email')} </h6>} rules={[{ required: true, message: t('toastMessage.emailAddress'), type: 'email' }]} required={true}>
                                <Input placeholder={t('auth.SignUp.email')} className="authInput" allowClear={true} suffix={<MdEmail className='text-defaultDarkColor text-[1.5rem]' />} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item name="contactNumber" label={<h6 className={`${inputLabelStyle}`}>{t('auth.SignUp.contact')}</h6>}
                                rules={[
                                    { required: true, whitespace: true, message: t('toastMessage.contactNumber') },
                                    {
                                        pattern: /^[0-9]{10}$/,
                                        message: "Please enter exactly 10 digits"
                                    }
                                ]}
                                required={true}>
                                <Input placeholder={t('auth.SignUp.contact')} className="authInput" allowClear={true} maxLength={10} minLength={10} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item name="password" label={<h6 className={`${inputLabelStyle}`}>{t('auth.SignUp.password')}</h6>}
                                rules={[{ required: true, message: t('toastMessage.password') }, { min: 8, message: `Minumun length must be 8 digit` },
                                {
                                    validator: validate
                                },]}
                                required={true}>
                                <Input.Password className="authInput" placeholder={t('auth.SignUp.password')} iconRender={(visible) => (visible ? <FaEye className='' style={{ color: colorCode.defaultDarkColor, fontSize: `1.5rem`, cursor: 'pointer' }} /> : <IoMdEyeOff style={{ color: colorCode.defaultDarkColor, fontSize: `1.5rem`, cursor: 'pointer' }} />)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item name="confirmPassword" label={<h6 className={`${inputLabelStyle}`}>{t('auth.SignUp.confirmPassword')}</h6>} dependencies={['password']} hasFeedback rules={[{ required: true, message: t('toastMessage.confirmPassword') }, ({ getFieldValue }) => ({ validator(rule, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject('The passwords do not match.'); }, })]} required={true}>
                                <Input.Password className="authInput" placeholder={t('auth.SignUp.confirmPassword')} iconRender={(visible) => (visible ? <FaEye className='' style={{ color: colorCode.defaultDarkColor, fontSize: `1.5rem`, cursor: 'pointer' }} /> : <IoMdEyeOff style={{ color: colorCode.defaultDarkColor, fontSize: `1.5rem`, cursor: 'pointer' }} />)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form.Item className='text-center mb-1.5'>
                                <Button type='ghost' loading={isLoading} className={`authButton`} htmlType='submit'>{t('buttons.submit')}</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <div className='flex justify-end mb-4'>
                    <Link className={linkStyle} to={'/'}>{t('toastMessage.alreadyLogin')}</Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
