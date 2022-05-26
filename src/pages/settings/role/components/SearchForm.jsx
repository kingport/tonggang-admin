import React, { useImperativeHandle, forwardRef } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Space, Row, Form, Input } from 'antd';
const { Item: FormItem } = Form;

const SearchForm = (props, ref) => {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const onFinish = (e) => {
    const { getRoleList } = props
    const params = {
      page_size: 10,
      page_index: 1,
      ...e
    }
    getRoleList(params)
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
  };
  return (
    <Form {...layout} form={form} onFinish={onFinish} layout="inline" hideRequiredMark>
      <Row>
        <FormItem name="name" label="角色名称">
          <Input placeholder="请输入角色名称" />
        </FormItem>
        <FormItem {...tailLayout}>
          <Space>
            <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
              查询
            </Button>
            <Button icon={<ReloadOutlined />} htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Space>
        </FormItem>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
