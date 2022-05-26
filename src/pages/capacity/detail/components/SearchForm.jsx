import React from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Space, Row, Form, Input } from 'antd';
const { Item: FormItem } = Form;

const SearchForm = (props) => {
  const [form] = Form.useForm();
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
  const onFinish = (values) => {
    const params = {
      activity_id: props.activityId,
      ...values
    }
    // 请求列表
    props.couponList(params)
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
  };
  return (
    <Form {...layout} form={form} onFinish={onFinish} layout="inline" hideRequiredMark>
      <Row>
        <FormItem name="phone" label="手机号">
          <Input placeholder="请输入手机号" />
        </FormItem>
        <FormItem name="order_id" label="订单编号">
          <Input placeholder="请输入订单编号" />
        </FormItem>
        <FormItem name="coupon_code" label="优惠码">
          <Input placeholder="请输入优惠码" />
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

export default SearchForm;
