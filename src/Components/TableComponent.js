import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import { itemRender } from 'Utils/UtilityFunctions'
import LoaderComponent from './LoaderComponent'
import NoDataFoundComponent from './NoDataFoundComponent'

const TableComponent = ({ loading = false, dataSource, columns, pagination, handlePaginationChange, searchData }) => {
    const [initialLoadingCompleted, setInitialLoadingCompleted] = useState(false);

    useEffect(() => {
        if (!loading) {
            setInitialLoadingCompleted(true);
        }

    }, [loading]);
    return (
        <div className='backgroundShadow h-full'>
            <Table dataSource={dataSource}
                className='h-full'
                scroll={{ x: 300 }}
                columns={columns}
                locale={{
                    emptyText: !loading && initialLoadingCompleted && dataSource.length === 0 ? <NoDataFoundComponent searchData={searchData} /> : null
                }}
                total={pagination?.total}
                key={pagination.page}
                pagination={pagination?.total > 10 ? { ...pagination, current: pagination.page, onChange: handlePaginationChange, position: ['bottomRight'], itemRender: itemRender, } : false}
                loading={{ spinning: loading, indicator: <LoaderComponent /> }}
            />
        </div>
    )
}

export default TableComponent