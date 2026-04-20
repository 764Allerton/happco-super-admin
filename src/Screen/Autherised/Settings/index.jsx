import { Button, Col, Form, Input, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import BreadCrumbComponent from 'Components/BreadCrumbComponent';
import React, { useEffect } from 'react'
import { useGetSettingsDataQuery, useUpdateSettingsMutation } from 'Rtk/services/settings';
import Toast from 'Utils/Toast';

const Settings = () => {
    const [form] = Form.useForm();

    const result = useGetSettingsDataQuery({
        refetchOnMountOrArgChange: true,
    });
    const [updateSettings] = useUpdateSettingsMutation();

    const handleSubmit =async (values) => {
        try {
            let payload = {
                Id:`${result?.data?.data?._id}`,
                consent_content: values?.consent,
                voice_clone_content: values?.content,
            }
            let result1 = await updateSettings(payload).unwrap();
            Toast('s', result1?.message);
        } catch (error) {
            if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error) 
        }
    }

    useEffect(() => {
     form.setFieldsValue({
        consent : result?.data?.data?.consent_content,
        content : result?.data?.data?.voice_clone_content
     })
    }, [result])
    

    return (
        <div>
            <div className='flexBetween mb-4 smMin:flex-col'>
                <BreadCrumbComponent
                    mainTitle="Home"
                    title="Settings" // or any title relevant to your current page
                    className="smMin:mb-2"
                />
            </div>
            <div className='bg-defaultWhiteColor shadow-md p-3 mt-5 h-[70vh] flexCenter'>
                <Form layout='vertical' className='my-3 w-100 modalForm' form={form} onFinish={handleSubmit} >
                    <Row className='justify-center '>
                        <Col xs={24} md={24} lg={6} xl={6}>
                            <div className='text-center fw-bold text-xl'>
                                Voice over Consent
                            </div>
                        </Col>
                        <Col xs={24} md={24} lg={18} xl={18}>
                            <Form.Item name="consent" rules={[{ required: true, message: 'Please enter Voice over Consent', whitespace: true }]}>
                                <Input value={result?.data?.data?.consent_content} placeholder={'Voice over Consent'} className='text-lg' />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={6} xl={6}>
                            <div className='text-center fw-bold text-xl'>
                                Voice over Content
                            </div>
                        </Col>
                        <Col xs={24} md={24} lg={18} xl={18}>
                            <Form.Item name="content" rules={[{ required: true, message: 'Please enter Voice over Content', whitespace: true }]} className='text-center'>
                                <TextArea placeholder={'Voice over Content'} value={result?.data?.voice_clone_content} className='text-lg min-h-[200px]' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className='flex justify-center items-center mt-5'>
                            <Button type='ghost' className={'commonButton text-white !bg-defaultLightColor rounded w-[13rem] smMin:w-[5rem]'} htmlType={'submit'}>UPDATE</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Settings