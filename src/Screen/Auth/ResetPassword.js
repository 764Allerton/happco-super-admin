import { Button, Form, Image } from 'antd'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdEyeOff } from 'react-icons/io';
import { FaEye } from 'react-icons/fa';
import { colorCode, MediaEndpoints } from 'Utils/MediaEndpoints';
import { t } from 'i18next';
import { validate } from 'Utils/UtilityFunctions';
import Toast from 'Utils/Toast';
import { useResetPasswordMutation } from 'Rtk/services/auth';

const cardAuthStyle = "w-[50%] smMin:w-[100%] smMin:px-0 p-2 px-[7rem] sm:px-[3rem] md:px-[4rem] sm:py-[2rem] lg:py-[2rem] lg:px-[9rem] h-[92.5vh] justify-center items-center"
const formStyle = "sm:w-[100%] md:w-[75%] 2xl:w-[66%] mt-3"

const ResetPassword = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const [resetPassword, { isLoading }] = useResetPasswordMutation()
    const email = new URLSearchParams(search).get('email');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);


    const handleReset = async (value) => {
        let payload;
        if (email) {
            payload = {
                new_password: value?.password,
                email: email,
                os_type: 'web'
            }
        }
        else {
            Toast('e', "Please Do it again from forgot password click");
            return;
        }

        try {
            const result = await resetPassword(payload).unwrap();
            Toast('s', result?.message);
            navigate('/', { replace: true })
        } catch (error) {
            if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error)  
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const togglePasswordConfirmVisibility = () => {
        setPasswordConfirmVisible(!passwordConfirmVisible);
    };

    return (
        <div className='authPage'>
            <div className='flex justify-center bg-defaultLightColor h-[92.5vh] w-[50%] items-center smMin:hidden'>
                <Image src={MediaEndpoints.logoLogin} className='logo' width={250} preview={false} />
            </div>
            <div className={`cardAuth ${cardAuthStyle}`}>
                <h4 className='my-2 font-700 text-lg'>{t('auth.reset.resetPassword')}</h4>
                <h5 className='text-center font-700 text-sm' >{t('auth.reset.title')} <br />{t('auth.reset.title1')}</h5>
                <Form className={formStyle} onFinish={(value) => handleReset(value)} layout="vertical" autoComplete="off">
                    <Form.Item name="password"
                        rules={[{ required: true, message: t('toastMessage.password') }, { min: 8, message: `Minumun length must be 8 digit` }, {
                            validator: validate
                        },]}
                        required={true} >
                        <div className='bg-[#F4F4F4] p-3 rounded'>
                            <div className='text-xs text-slate-400'>New Password</div>
                            <div className='flex items-center'>
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    className='w-[90%] border-none focus-visible:outline-0 p-0.5 bg-[#F4F4F4]'
                                    placeholder='********'
                                />
                                <button
                                    type='button'
                                    onClick={togglePasswordVisibility}
                                    className='border-none bg-transparent cursor-pointer ml-2'
                                >
                                    {passwordVisible
                                        ? <IoMdEyeOff style={{ color: colorCode.defaultDarkColor, fontSize: '1.5rem' }} />
                                        : <FaEye style={{ color: colorCode.defaultDarkColor, fontSize: '1.5rem' }} />
                                    }
                                </button>
                            </div>
                        </div>
                    </Form.Item>
                    <Form.Item name="password_con" dependencies={['password']} rules={[
                        {
                            required: true,
                            message: t('toastMessage.newPassword'),
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('toastMessage.newPasswordMatch')));
                            },
                        }),
                    ]} required={true} >
                        <div className='bg-[#F4F4F4] p-3 rounded'>
                            <div className='text-xs text-slate-400'>Confirm Password</div>
                            <div className='flex items-center'>
                                <input
                                    type={passwordConfirmVisible ? 'text' : 'password'}
                                    className='w-[90%] border-none focus-visible:outline-0 p-0.5 bg-[#F4F4F4]'
                                    placeholder='********'
                                />
                                <button
                                    type='button'
                                    onClick={togglePasswordConfirmVisibility}
                                    className='border-none bg-transparent cursor-pointer ml-2'
                                >
                                    {passwordConfirmVisible
                                        ? <IoMdEyeOff style={{ color: colorCode.defaultDarkColor, fontSize: '1.5rem' }} />
                                        : <FaEye style={{ color: colorCode.defaultDarkColor, fontSize: '1.5rem' }} />
                                    }
                                </button>
                            </div>
                        </div>
                    </Form.Item>
                    <Form.Item className='text-center'>
                        <Button loading={isLoading}  type='ghost'  className={`authButton`} htmlType='submit' >{t('buttons.confirm')}</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default ResetPassword