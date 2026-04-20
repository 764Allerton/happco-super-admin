import React from 'react'

const DisplayValueComp = ({ title, value }) => {
    return (
        <div>
            <div>{title}</div>
            <div className='bg-[#F2F2F2] py-3 pl-2 rounded w-90 break-all min-h-12'>
                {value}
            </div>
        </div>
    )
}

export default DisplayValueComp