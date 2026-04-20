// InputField.js
import React from 'react';

const InputField = ({ label, placeholder, Icon, type = 'text', ...props }) => {
  return (
    <div className='bg-[#F4F4F4] p-3 rounded'>
      <div className='text-xs text-slate-400'>{label}</div>
      <div className='flex items-center'>
        <input 
          type={type}
          className='w-[90%] border-none focus-visible:outline-0 p-0.5 bg-[#F4F4F4]'
          placeholder={placeholder}
          {...props}
        />
        {Icon && <span>{<Icon className='text-defaultDarkColor text-[1.5rem]' />}</span>}
      </div>
    </div>
  );
};

export default InputField;
