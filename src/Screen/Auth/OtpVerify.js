import { Button, Image, Typography } from 'antd'
import React, { useState } from 'react'
import OtpInput from 'react-otp-input';
import { MediaEndpoints } from 'Utils/MediaEndpoints';
import Toast from 'Utils/Toast';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {  useForgetPasswordMutation, useVerifyOtpMutation } from 'Rtk/services/auth';

const cardAuthStyle = "w-[50%] smMin:w-[100%] smMin:px-0 p-2 px-[7rem] sm:px-[3rem] md:px-[4rem] sm:py-[2rem] lg:py-[2rem] lg:px-[9rem] h-[92.5vh] justify-center items-center"
const formStyle = "sm:w-[100%] md:w-[75%] 2xl:w-[66%]"
const linkStyle = `text-xs font-extrabold italic hover:text-defaultDarkColor border-none shadow-none`

const OtpVerify = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const email = location.state?.email;
    // const signup = new URLSearchParams(search).get('signup');
    const [otp, setOtp] = useState('');
    const [otpVerify, { isLoading }] = useVerifyOtpMutation()
    // const verifyTest = useVerifyOtpMutation()
    const [forget, { isLoading: isLoadingResend }] = useForgetPasswordMutation();


    const handleVerifyOtp = async () => {
        let payload;
        if (otp) {
            payload = {
                email: email,
                otp: otp,
                os_type: 'web'
            }
        } else {
            Toast('e', "Please Enter OTP to continue");
            return;
        }
        try {
            const result = await otpVerify(payload).unwrap();
            Toast('s', result?.message);
            navigate(`/resetPassword?email=${email}`, { replace: true })
        } catch (error) {
            if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error)  
        }
    };

    const handleResendOtp = async () => {
        let payload = {
            email: email,
            os_type: 'web'
        }

        try {
            const result = await forget(payload).unwrap();
            Toast('s', result?.message);
        } catch (error) {
            if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error) 
        }
    };

    return (
        <div className='authPage'>
            <div className='flex justify-center bg-defaultLightColor h-[92.5vh] w-[50%] items-center smMin:hidden'>
                <Image src={MediaEndpoints.logoLogin} className='logo' width={250} preview={false} />
            </div>
            <div className={`cardAuth ${cardAuthStyle}`}>
                <h5 className='text-center my-2 text-sm font-700'>{t('auth.otp.title1')}<br />{t('auth.otp.title2')}</h5>
                <div className={formStyle}>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        placeholder="****"
                        containerStyle="otp_container"
                        inputStyle="otp_input_container"
                        shouldAutoFocus={true}
                        renderInput={(props) => <input {...props} />}
                    />
                    <div className='flex justify-between items-center'>
                        <Typography className='text-center my-2 textStyle'>{t('auth.otp.notCode')}</Typography>
                        <Button className={linkStyle} loading={isLoadingResend} onClick={() => { handleResendOtp() }} >{t('auth.otp.resend')}</Button>
                    </div>
                </div>
                <Button type='ghost' loading={isLoading} onClick={() => { handleVerifyOtp() }} className={`authButton`} >{t('buttons.verify')}</Button>
            </div>
        </div>
    )
}

export default OtpVerify