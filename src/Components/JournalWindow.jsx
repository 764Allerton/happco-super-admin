import React, { useRef } from 'react'
import SearchComponent from './SearchComponent'
import { Input } from 'antd'
import { IoSend } from 'react-icons/io5'
import { colorCode } from 'Utils/MediaEndpoints'

const JournalWindow = ({ journalList }) => {
    const attachmentRef = useRef(null);

    return (
        <div className='h-full relative'>
            <div className='flexBetween mb-4 smMin:flex-col items-center pt-3'>
                <div className='text-2xl font-bold text-defaultDarkColor'>Journal</div>
                <div className='flex jusitfy-between items-center mt-3 lg:mt-0'>
                    <SearchComponent placeholder={"search.."} inlineStyle={" "} cssStyle={"!w-[130px] px-0"}  iconStyle={"size-5"}/>
                </div>
            </div>
            <div>
                <div className='overflow-y-auto h-[630px] mb-4 smMin:h-auto'>
                    {journalList?.map((item) => {
                        return (
                            <>
                                <div className='p-1 my-2' key={item?._id}>
                                    <div className='text-md'> {item?.message} </div>
                                    <div className='text-xs text-end'>{item?.time}</div>
                                </div>
                            </>
                        )
                    })
                    }
                </div>
            </div>
            <div className='w-full absolute bottom-[20px] smMin:bottom-[-10px]'>
                <Input
                    type="text"
                    className='mx-1 '
                    suffix={<span className='cursor-pointer'
                        ref={attachmentRef}
                    ><IoSend color={colorCode?.defaultDarkColor} size={20} /></span>}
                />
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={attachmentRef}
                />
            </div>
        </div>
    )
}

export default JournalWindow