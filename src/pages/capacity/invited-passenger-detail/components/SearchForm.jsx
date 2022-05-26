import React from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Space, Form, Input } from 'antd';
const { Item: FormItem } = Form;

const SearchForm = (props) => {
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  /**
   * @description: 查询列表
   * @param {object} values 查询参数
   * @return {*}
   */
  const onFinish = (values) => {
    const params = {
      ...values,
    };
    props.getDetail(params);
  };

  /**
   * @description: 重置表单
   * @return {*}
   */
  const onReset = () => {
    form.resetFields();
  };
  return (
    <Form form={form} onFinish={onFinish} layout="inline" hideRequiredMark>
      <FormItem name="passenger_id" label="被邀请者ID">
        <Input placeholder="请输入被邀请者ID" />
      </FormItem>
      <FormItem name="order_id" label="订单编号">
        <Input placeholder="请输入订单编号" />
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
    </Form>
  );
};

export default SearchForm;
