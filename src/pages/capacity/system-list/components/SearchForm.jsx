import React, { forwardRef, useImperativeHandle } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Input, Col } from 'antd';
import { statusList } from '@/utils/constant';
const { Item: FormItem } = Form;
const { Option } = Select;

const SearchForm = (props, ref) => {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const onFinish = (e) => {
    props.systemCouponList(e);
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
  };
  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="phone" label="乘客手机号">
            <Input placeholder="请输入手机号" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="order_id" label="订单编号">
            <Input placeholder="请输入订单编号" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="coupon_code" label="优惠码">
            <Input placeholder="请输入优惠码" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="status" label="使用状态">
            <Select
              placeholder="请选择使用状态"
              allowClear
              showSearch
            >
              {statusList.map((item) => {
                return (
                  <Option key={item.key} value={item.key}>
                    {item.value}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            style={{ margin: '0 8px' }}
            htmlType="button"
            onClick={onReset}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
