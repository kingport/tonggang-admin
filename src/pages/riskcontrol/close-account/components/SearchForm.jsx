import React, { useImperativeHandle, forwardRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Row, Form, Input, Col, Descriptions } from 'antd';
const { Item: FormItem } = Form;

const SearchForm = (props, ref) => {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const onFinish = (e) => {
    const { getCancelRuleList } = props;
    getCancelRuleList(e);
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="channel" label="司机手机号">
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Descriptions title="司机信息" bordered>
          <Descriptions.Item label="账号">存在系统</Descriptions.Item>
          <Descriptions.Item label="司机信息" span={2}>
            无
          </Descriptions.Item>
        </Descriptions>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ margin: '0 8px' }} htmlType="button" onClick={onReset}>
            注销
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
