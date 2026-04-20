
import React, { useEffect, useState } from 'react'
import BreadCrumbComponent from 'Components/BreadCrumbComponent';
import DeleteModal from 'Components/DeleteModal';
import SearchComponent from 'Components/SearchComponent';
import TableComponent from 'Components/TableComponent';
import { t } from 'i18next';
import Toast from 'Utils/Toast';
import { MdDelete, MdEdit } from 'react-icons/md';
import { Button, Popconfirm, Select } from 'antd';
import { useGetHcDataQuery, useUpdateHcDetailsMutation } from 'Rtk/services/hc';
import { fileUrl } from 'Constants/Url';
import { htmlDecode } from 'Utils/UtilityFunctions';
import { useNavigate } from 'react-router-dom';

const typeMappings = [
    { label: 'Family & Friends', value: 'family' },
    { label: 'Self (Inner Work)', value: 'self' },
    { label: 'Superior', value: 'superior' },
    { label: 'Direct Report', value: 'report' },
    { label: 'Peers (Co-Workers)', value: 'peers' },
];

const HC = () => {
    const [dataSource, setDataSource] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
        position: ['bottomRight'],
    })
    const navigate = useNavigate();
    const result = useGetHcDataQuery({ page: pagination?.page, limit: pagination?.pageSize, type: filterType, searchData: searchQuery }, {
        refetchOnMountOrArgChange: true,
    });
    const [updateHcDetails] = useUpdateHcDetailsMutation();

    const onChangeSearch = (query) => {
        setSearchQuery(query)
    };

    useEffect(() => {
        if (result?.data?.data?.data?.length > 0) {
            setDataSource(result?.data?.data?.data)
            setPagination((prevPagination) => ({
                ...prevPagination,
                total: result?.data?.data?.totalCount
            }));
        }
        if (result?.error?.status == 400) {
            setDataSource(result?.error?.data)
            setPagination((prevPagination) => ({
                ...prevPagination,
                total: 0
            }));
        }
    }, [result?.data?.data, result])

    const handlePageChange = (page, pageSize) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            page: page,
            pageSize: pageSize,
        }));
    };

    const handleEdit = (record) => {
        navigate('/AddEditAction', { state: { id: record?._id, record: record } })
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => <span>{((pagination?.page - 1) * pagination?.pageSize) + (index + 1)}</span>,
            width: 50,
            align: "center"
        },
        {
            title: 'Code',
            dataIndex: 'hc_code',
            key: 'hc_code',
            width: 80,
            ellipsis: true,
            align: "center",
            render: (item) => item
        },
        {
            title: "Icon",
            dataIndex: 'icon',
            key: 'icon',
            width: 70,
            align: "center",
            render: (i) => <div className='flexCenter'> <img src={`${fileUrl}${i}`} alt='' className='w-[50px] h-[50px] ' /></div>
        },
        {
            title: 'Title',
            dataIndex: 'titleFirst',
            key: 'titleFirst',
            width: 80,
            ellipsis: true,
            align: "center",
            render: (item) => item
        },
        {
            title: 'Sub Title',
            dataIndex: 'title',
            key: 'title',
            width: 80,
            ellipsis: true,
            align: "center",
            render: (item) => item
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text, _, index) => {
                const rtn = htmlDecode(text)
                return rtn
            },
            width: 50,
            ellipsis: true,
            align: "center"
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                const matchedType = typeMappings.find(item => item.value === text);
                return matchedType ? matchedType.label : text;
            },
            width: 80,
            ellipsis: true,
            align: "center",
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            key: 'Action',
            width: 100,
            render: (text, record) => {
                return (
                    <div className='flex justify-center gap-3' >
                        <MdEdit
                            onClick={() => handleEdit(record)}
                            className='viewIconEdit'
                        />
                        <Popconfirm
                            title="Are you sure you want to delete this action?"
                            onConfirm={() => handleDeleteButton(record)}
                            okText="Yes"
                            cancelText="No">
                            <MdDelete className='viewIconDel' />
                        </Popconfirm>
                    </div>
                )
            },
            align: "center",
        },
    ];

    const handleUpdateUser = async (payload) => {
        try {
            let result = await updateHcDetails(payload).unwrap();
            Toast('s', result?.message);
            setOpenDelete(false)
        } catch (error) {
            setOpenDelete(false)
            if (error?.data?.message) {
                Toast('e', error?.data?.message)
            } else Toast('e', error?.error)
        }
    }

    const handleDeleteButton = (record) => {
        const newPage = dataSource?.length === 1 && pagination?.page > 1 ? pagination?.page - 1 : pagination?.page;
        setPagination((prev) => ({
            ...prev,
            page: newPage
        }));
        let payload = {
            status: "2",
            Id: record?._id
        }
        handleUpdateUser(payload)
    };

    const addNewActionOnCLick = () => {
        navigate('/AddEditAction')
    }

    const resetPagination = (e) => {
        handlePageChange(1, pagination?.pageSize)
        setFilterType(e)
    }

    return (
        <div>
            <div className='flexBetween mb-4 smMin:flex-col'>
                <BreadCrumbComponent
                    mainTitle="Home"
                    title="Actions" // or any title relevant to your current page
                    className="smMin:mb-2"
                />
                <div className='flex jusitfy-between items-center smMin:flex-col'>
                    <Select
                        placeholder="Filter By Type"
                        style={{width: 200, height: 48, borderColor: '#749B98'}}
                        className='mr-3 border-2 rounded-md'
                        defaultValue={''}
                        onChange={(e) => resetPagination(e)}
                        options={[
                            { label: 'All', value: ''},
                            { label: 'Family & Friends', value: 'family' },
                            { label: 'Self (Inner Work)', value: 'self' },
                            { label: 'Superior', value: 'superior' },
                            { label: 'Direct Report', value: 'report' },
                            { label: 'Peers (Co-Workers)', value: 'peers' },
                        ]}
                    />
                    <SearchComponent placeholder={`Search...`} inlineStyle='w-[200px] !h-[48px]  smMin:my-2  mr-2 smMin:mr-0 border-2 rounded-md !border-defaultDarkColor' onChangeSearch={onChangeSearch} />
                    <Button type="ghost" onClick={addNewActionOnCLick} className='commonButton w-[200px] smMin:w-[218px] ml-2 smMin:ml-0  h-[3rem]  smMin:h-[30px] min-w-[150px]' >{"Add New Actions"}</Button>
                </div>
            </div>
            <TableComponent
                dataSource={dataSource?.length > 0 ? dataSource : []}
                columns={columns}
                loading={result?.isLoading}
                pagination={pagination}
                handlePaginationChange={handlePageChange}
                searchData={searchQuery}
            />
            {openDelete && <DeleteModal deleteModalOpen={openDelete} setDeleteModalOpen={setOpenDelete} delType={t('users.user')} deleteCall={handleDeleteButton} />}
        </div>
    )
}
export default HC