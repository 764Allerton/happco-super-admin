import React from 'react';
import { Image } from 'antd';
import { ThreeDots } from 'react-loader-spinner';
import { colorCode, MediaEndpoints } from 'Utils/MediaEndpoints';

const LazyLoading = () => {
    return (
        <div className='flexCenter h-[100vh]' >
            <div className='mx-auto flex-column'>
                <Image preview={false} src={MediaEndpoints.logo} height={100}/>
                <div  className='mx-4 flex justify-center'>
                <ThreeDots
                    visible={true}
                    height="80"
                    width="80"
                    radius="9"
                    color={colorCode?.defaultLightColor}
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
                </div>
            </div>
        </div>
    )
}

export default LazyLoading