import { Image } from 'antd'
import React from 'react'
import { MediaEndpoints } from 'Utils/MediaEndpoints'

function NoDataFoundComponent({ searchData }) {
  return (
    <div className='text-center'>
      <Image preview={false} src={MediaEndpoints.noData} height={320} />
      {
        searchData &&
        <h3 >{`No Data Found For : *${searchData}*`}</h3>
      }
    </div>
  )
}

export default NoDataFoundComponent