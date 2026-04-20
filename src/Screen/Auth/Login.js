
import { Button, Form, Image } from 'antd'
import { FaEye } from 'react-icons/fa';
import { IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { MediaEndpoints, colorCode } from 'Utils/MediaEndpoints';
import Toast from 'Utils/Toast';
import { useLoginMutation } from 'Rtk/services/auth';
import { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import InputField from 'Components/InputComponent';

const inputStyle = "mx-auto font-700 text-xl mb-[1.5rem] sm:mb-4 md:mb-5 lg:mb-[1.5rem]"
const cardAuthStyle = "w-[50%] smMin:w-[100%] smMin:px-0 p-2 sm:px-[3rem] md:px-[0rem] sm:py-[2rem] lg:py-[2rem] lg:px-[2rem] xl:px-[4rem] h-[92.5vh] justify-center items-center"
const formStyle = "sm:w-[100%] md:w-[75%] 2xl:w-[66%] smMin:w-[60%]"
const linkStyle = `text-xs font-extrabold italic  hover:text-defaultDarkColor`

const Login = () => {
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [login, { isLoading }] = useLoginMutation();
  // const [value, setValue] = useState("Client");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // const onChange = (e) => {
  //   setValue(e.target.value);
  // };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (value) => {
    let payload = {
      email: value?.email,
      password: value?.password,
      os_type: 'web'
    }
    try {
      login(payload).unwrap();
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.log("error", error)
      if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error) 
    }
  }

  return (
    <div className='authPage'>
      <div className='flex justify-center bg-gradient-to-r-default h-[92.5vh] w-[50%] items-center smMin:hidden'>
        <Image src={MediaEndpoints.logoLogin} className='logo' width={250} preview={false} />
      </div>
      <div className={`cardAuth ${cardAuthStyle}`}>
        <h2 className='text-[1.5rem] mdMin:text-[1rem] font-bold mb-3 text-center'>Welcome HappCo Administrator</h2>
        <h1 className='text-[2rem] font-bold m-0'>LOGIN</h1>
        <h5 className={`text-center ${inputStyle}`} >Please Login to continue
        </h5>
        <Form
          className={formStyle}
          form={loginForm}
          onFinish={(value) => handleLogin(value)}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please Enter Email", type: 'email' }]}
            required={true}
          >
            <InputField
              label="Email"
              placeholder='Enter Here'
              Icon={MdEmail}
            />
          </Form.Item>

          <Form.Item
            name="password"
            className='mb-1.5'
            rules={[{ required: true, message: "Please Enter Password" }]}
            required={true}
          >
            <div className='bg-[#F4F4F4] p-3 rounded'>
              <div className='text-xs text-slate-400'>Password</div>
              <div className='flex items-center'>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  className='w-[88.3%] border-none focus-visible:outline-0 p-0.5 bg-[#F4F4F4]'
                  placeholder='Enter Here'
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

          <div className='flex justify-end '>
            <Link className={`${linkStyle} textStyle`} to={'/forget'}>
            Forgot Password?
            </Link>
          </div>

          <Form.Item className='text-center mb-1.5'>
            <Button
              type='ghost'
              loading={isLoading}
              className={'authButton'}
              htmlType='submit'
            >
              LOGIN
            </Button>
          </Form.Item>

          {/* <div className='flexCenter mb-1.5'>
            <Link className={`${linkStyle} textStyle`} to={'/signup'}>
              {t('toastMessage.dontAccSingup')}
            </Link>
          </div> */}
        </Form>
      </div>
    </div >
  )
}

export default Login