import { Button, Image, Modal, Typography } from "antd";
import React from "react";
import { MediaEndpoints } from "Utils/MediaEndpoints";
import { t } from 'i18next';

const DeleteModal = ({ deleteModalOpen, setDeleteModalOpen, delType, deleteCall, loading,warning }) => {

    const yesClick = () => {
        deleteCall()
    }

    return (
        <>
            <Modal className='ModalDelete' centered open={deleteModalOpen} onCancel={() => setDeleteModalOpen(false)} footer='' width={400}>
                <div className='text-center'>
                    <div className='mb-3 mt-3'>
                        <Image src={MediaEndpoints.deleteIcon} height={'120px'} preview={false} />
                    </div>
                    <div className='mb-4'>
                        <h5><b>{t('buttons.deleteKey')} {delType}</b></h5>
                        {warning ? <Typography>{warning}</Typography> :
                            <Typography>{t('toastMessage.delete')}<br />{t('toastMessage.this')} {delType}?</Typography>}
                    </div>
                    <div className='flex justify-center mt-3 gap-3'>
                        <Button type="ghost" onClick={() => { setDeleteModalOpen(false) }} className='bg-red-500 authButton w-[8rem]'> {t('buttons.cancel')}</Button>
                        <Button type="ghost" loading={loading} onClick={() => { yesClick() }} className='authButton w-[8rem]' >{t('buttons.deleteKey')}</Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default DeleteModal