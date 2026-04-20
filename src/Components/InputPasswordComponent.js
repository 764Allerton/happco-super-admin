import React, { useState } from 'react';
import { IoMdEyeOff } from 'react-icons/io';
import { FaEye } from 'react-icons/fa';
import { colorCode } from 'Utils/MediaEndpoints';

const PasswordInputComponent = ({ placeholder = '******', title= "Password" }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className='bg-[#F4F4F4] p-3 rounded'>
            <div className='text-xs text-slate-400'>{title}</div>
            <div className='flex items-center'>
                <input
                    type={passwordVisible ? 'text' : 'password'}
                    className='w-[90%] border-none focus-visible:outline-0 p-0.5 bg-[#F4F4F4]'
                    placeholder={placeholder}
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
    );
};

export default PasswordInputComponent;
