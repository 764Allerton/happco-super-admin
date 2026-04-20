import { Button, Form, Image} from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import { MediaEndpoints } from 'Utils/MediaEndpoints';
import { t } from 'i18next';
import Toast from 'Utils/Toast';
import { useForgetPasswordMutation } from 'Rtk/services/auth';
import InputField from 'Components/InputComponent';

const cardAuthStyle = "w-[50%] smMin:w-[100%] smMin:px-0 p-2 px-[7rem] sm:px-[3rem] md:px-[0rem] sm:py-[2rem] lg:py-[2rem] lg:px-[2rem] xl:px-[4rem] h-[92.5vh] justify-center items-center"
const formStyle = "sm:w-[100%] md:w-[75%] 2xl:w-[66%]"

const Forget = () => {
    const navigate = useNavigate();
    const [forget, { isLoading }] = useForgetPasswordMutation();

    const handleForgot = async (value) => {
        let email = value?.email?.toLowerCase().trim()
        let payload = {
            email: email,
            os_type: 'web'
        }
        try {
            const result = await forget(payload).unwrap();
            Toast('s', result?.message);
            navigate('/otpVerify', { replace: true , state: { email: email }});
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
                <h4 className='my-2 font-bold text-base'>{t('auth.forgot.title')} </h4>
                <Form className={formStyle} onFinish={(value) => handleForgot(value)} layout="vertical" autoComplete="off">
                    <Form.Item name="email"  rules={[{ required: true, message: t('toastMessage.email'), type: 'email', }]} required={true} >
                        <InputField
                            label={t('inputLabels.email')}
                            placeholder='Enter Your Email Here..'
                            Icon={MdEmail}
                        />
                    </Form.Item>
                    <Form.Item className='text-center'>
                        <Button loading={isLoading} type='ghost' className={`authButton`} htmlType='submit' >{t('buttons.contiune')} </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Forget