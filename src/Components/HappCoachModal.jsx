import React from 'react';
import { Modal, Form, Input, Button, Row, Col, Select } from 'antd';

const HappCoachModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values) => {
    form.resetFields();
    onSubmit(values);
  };

  return (
    <Modal
      title={<div className='text-center font-bold'>Add New Happ Coach</div>}
      centered
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        layout='vertical'
        className='my-3 w-100 modalForm'
        form={form}
        onFinish={handleSubmit}
      >
        <Row className='justify-between my-3'>
          <Col xs={24} md={24} lg={11} xl={11}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: 'Please enter name', whitespace: true },
              ]}
            >
              <Input placeholder='Name' />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={11} xl={11}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email", message: 'Please enter email',whitespace: true }]}
            >
              <Input placeholder='Email' />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={11} xl={11}>
            <Form.Item
              name="division"
              label="Division"
              rules={[{ required: true, message: 'Please enter division',whitespace: true }]}
            >
              <Input placeholder='Division' />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={11} xl={11}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please select department' }]}
            >
              <Select
                mode="tags"
                placeholder="Select departments"
                options={[
                  { label: 'HR', value: 'hr' },
                  { label: 'Engineering', value: 'engineering' },
                  { label: 'Marketing', value: 'marketing' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className='flex justify-center items-center'>
          <Form.Item>
            <Button
              onClick={handleCancel}
              className='commonButton bg-gray-600 rounded border-none text-white mr-3 w-[11.5rem] smMin:w-[5rem]'
            >
              Cancel
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type='ghost'
              className='commonButton text-white !bg-defaultLightColor rounded w-[11.5rem] smMin:w-[5rem]'
              htmlType='submit'
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal >
  );
};

export default HappCoachModal;
