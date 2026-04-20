import React from 'react'
import { Puff } from 'react-loader-spinner'
import { colorCode } from 'Utils/MediaEndpoints'

const LoaderComponent = () => {
    return (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
            <Puff
                visible={true}
                height="80"
                width="80"
                color={colorCode?.defaultDarkColor}
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}

export default LoaderComponent